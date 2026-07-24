// Quick scoring without calling AI every time

const scorePost = (text) => {
  if (!text) return 0;
  
  const lower = text.toLowerCase();
  let score = 0;

  // Keywords = good leads
  const keywords = {
    'website': 10, 'app': 10, 'design': 8, 'development': 10,
    'budget': 15, 'budget:': 15, '$': 15, '₹': 15,
    'urgent': 5, 'asap': 5, 'deadline': 5,
    'project': 5, 'freelance': 5, 'hire': 5,
    'payment': 10, 'paid': 10, 'contract': 8,
    'email': 10, 'contact': 8, 'dm': 5
  };

  Object.entries(keywords).forEach(([word, points]) => {
    if (lower.includes(word)) score += points;
  });

  // Length = better (more details)
  if (text.length > 100) score += 10;
  if (text.length > 300) score += 10;
  if (text.length > 500) score += 5;

  // Sentences = detailed
  const sentences = text.split('.').length;
  if (sentences > 3) score += 5;

  return Math.min(100, score);
};

const getType = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('website') || lower.includes('web')) return 'website';
  if (lower.includes('app') || lower.includes('mobile')) return 'app';
  if (lower.includes('design') || lower.includes('ui') || lower.includes('ux')) return 'design';
  if (lower.includes('content') || lower.includes('writing') || lower.includes('blog')) return 'content';
  if (lower.includes('logo') || lower.includes('brand')) return 'branding';
  return 'other';
};

module.exports = { scorePost, getType };
