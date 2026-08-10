import Package from '../Models/PackagesModel.js';

export async function getQA(req, res) {
  try {
    const { packageId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pkg = await Package.findById(packageId).select('qa').lean();
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found.' });
    }

    // Newest first
    const all = [...(pkg.qa || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const total = all.length;
    const pages = Math.ceil(total / +limit);
    const qa    = all.slice((+page - 1) * +limit, +page * +limit);

    return res.json({ qa, total, page: +page, pages });
  } catch (err) {
    console.error('getQA:', err);
    return res.status(500).json({ message: 'Failed to fetch Q&A.' });
  }
}

// ─── POST /api/qa ─────────────────────────────────────────────────────────────
// Body: { packageId, question, authorName? }
export async function createQuestion(req, res) {
  try {
    const { packageId, question, authorName } = req.body;

    if (!packageId || !question) {
      return res.status(400).json({ message: 'packageId and question are required.' });
    }
    if (question.trim().length < 10) {
      return res.status(400).json({ message: 'Question must be at least 10 characters.' });
    }

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found.' });
    }

    // Resolve author name
    const author =
      req.user?.fullName ||
      req.user?.name     ||
      (authorName || '').trim() ||
      'Anonymous';

    // Contribution count = how many questions this user has already asked + 1
    const contributions = req.user?._id
      ? pkg.qa.filter((q) => String(q.userId) === String(req.user._id)).length + 1
      : 1;

    pkg.qa.push({
      userId:   req.user?._id || null,
      author,
      contributions,
      question: question.trim(),
    });

    await pkg.save();

    const saved = pkg.qa[pkg.qa.length - 1];
    return res.status(201).json({ message: 'Question posted.', qa: saved });
  } catch (err) {
    console.error('createQuestion:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Failed to post question.' });
  }
}

// ─── POST /api/qa/:questionId/answer ─────────────────────────────────────────
// Body: { answer }
// questionId = sub-document _id inside package.qa
export async function submitAnswer(req, res) {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;

    if (!answer || answer.trim().length < 5) {
      return res.status(400).json({ message: 'Answer must be at least 5 characters.' });
    }

    const pkg = await Package.findOne({ 'qa._id': questionId });
    if (!pkg) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    const qaItem = pkg.qa.id(questionId);
    if (!qaItem) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    const isOfficial = req.user?.role === 'admin' || req.user?.role === 'operator';
    const authorName =
      req.user?.fullName ||
      req.user?.name     ||
      (isOfficial ? 'Tour Expert' : 'Traveller');

    qaItem.answers.push({
      userId:     req.user?._id || null,
      authorName,
      text:       answer.trim(),
      isOfficial,
    });

    // Sync convenience fields
    qaItem.syncAnswer();
    await pkg.save();

    return res.json({ message: 'Answer submitted.', qa: qaItem });
  } catch (err) {
    console.error('submitAnswer:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Failed to submit answer.' });
  }
}