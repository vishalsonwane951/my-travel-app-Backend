import asyncHandler from 'express-async-handler';
import SiteSettings from '../../Models/SiteSettings.js';

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne({ key: 'site_settings' });
  if (!settings) settings = await SiteSettings.create({});
  return settings;
}

// GET /api/admin/settings
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, settings });
});

// PUT /api/admin/settings
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  const before = settings.toObject();
  Object.assign(settings, req.body);
  await settings.save();
  await req.audit?.({ action: 'update', module: 'settings', before, after: settings.toObject() });
  res.json({ success: true, settings });
});

// Public — used anywhere on the site that needs contact info / social links
export const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({
    success: true,
    settings: {
      siteName: settings.siteName,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      address: settings.address,
      socialLinks: settings.socialLinks,
      maintenanceMode: settings.maintenanceMode,
    },
  });
});
