import asyncHandler from 'express-async-handler';
import Package from '../../Models/PackagesModel.js';

// GET /api/admin/packages  — full CMS listing, including inactive/unfeatured packages
export const listAllPackagesForCms = asyncHandler(async (req, res) => {
  const { search, type, destination, active, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (type) filter.type = type;
  if (destination) filter.destination = destination;
  if (active !== undefined) filter.active = active === 'true';

  const [packages, total] = await Promise.all([
    Package.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    Package.countDocuments(filter),
  ]);

  res.json({ success: true, packages, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// PUT /api/admin/packages/:id/toggle-active
export const toggleActive = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
  pkg.active = !pkg.active;
  await pkg.save();
  await req.audit?.({ action: 'toggle_active', module: 'packages', targetId: pkg._id, after: { active: pkg.active } });
  res.json({ success: true, package: pkg });
});

// PUT /api/admin/packages/:id/toggle-featured
export const toggleFeatured = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
  pkg.featured = !pkg.featured;
  await pkg.save();
  await req.audit?.({ action: 'toggle_featured', module: 'packages', targetId: pkg._id, after: { featured: pkg.featured } });
  res.json({ success: true, package: pkg });
});

// PUT /api/admin/packages/:id/itinerary — replace the full day-wise itinerary array
// Body: { itinerary: [{ day, title, description, meals }] }
export const updateItinerary = asyncHandler(async (req, res) => {
  const { itinerary } = req.body;
  if (!Array.isArray(itinerary)) {
    return res.status(400).json({ success: false, message: 'itinerary must be an array of day objects.' });
  }
  const pkg = await Package.findByIdAndUpdate(req.params.id, { itinerary }, { new: true });
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
  await req.audit?.({ action: 'update_itinerary', module: 'packages', targetId: pkg._id });
  res.json({ success: true, package: pkg });
});

// ── Bulk CSV import ─────────────────────────────────────────────────────────
// Minimal, dependency-free CSV parser — handles quoted fields with embedded commas.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (field !== '' || row.length) { row.push(field); rows.push(row); }
      field = ''; row = [];
      if (c === '\r' && text[i + 1] === '\n') i++;
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).filter((r) => r.length && r.some((c) => c.trim() !== '')).map((r) => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (r[idx] || '').trim(); });
    return obj;
  });
}

// POST /api/admin/packages/bulk-import
// Body: raw CSV text as { csv: "title,location,type,destination,price,..." }
// Expected columns: title, location, type, destination, price, strikePrice,
// durations (semicolon-separated), description, highlights (semicolon-separated)
export const bulkImportPackages = asyncHandler(async (req, res) => {
  const { csv } = req.body;
  if (!csv || typeof csv !== 'string') {
    return res.status(400).json({ success: false, message: 'csv (string) is required in the request body.' });
  }

  const rows = parseCsv(csv);
  if (!rows.length) return res.status(400).json({ success: false, message: 'No data rows found in CSV.' });

  const docs = rows
    .filter((r) => r.title)
    .map((r) => ({
      title: r.title,
      location: r.location || '',
      type: (r.type || '').toLowerCase(),
      destination: r.destination || '',
      price: Number(r.price) || 0,
      strikePrice: r.strikePrice ? Number(r.strikePrice) : undefined,
      durations: r.durations ? r.durations.split(';').map((s) => s.trim()).filter(Boolean) : [],
      description: r.description || '',
      highlights: r.highlights ? r.highlights.split(';').map((s) => s.trim()).filter(Boolean) : [],
      active: true,
    }));

  if (!docs.length) {
    return res.status(400).json({ success: false, message: 'No valid rows (every row needs at least a title).' });
  }

  const result = await Package.insertMany(docs, { ordered: false });
  await req.audit?.({ action: 'bulk_import', module: 'packages', after: { count: result.length } });
  res.status(201).json({ success: true, message: `Imported ${result.length} package(s).`, imported: result.length });
});
