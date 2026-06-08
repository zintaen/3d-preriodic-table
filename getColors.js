const getCategoryColor = (cat) => {
  if (!cat) return 'bg-white/5 border-white/10 text-white/80';
  const lcat = cat.toLowerCase();
  if (lcat.includes('alkali metal')) return 'bg-red-500/20 border-red-500/30 text-red-100';
  if (lcat.includes('alkaline earth')) return 'bg-orange-500/20 border-orange-500/30 text-orange-100';
  if (lcat.includes('transition metal')) return 'bg-amber-500/20 border-amber-500/30 text-amber-100';
  if (lcat.includes('post-transition')) return 'bg-teal-500/20 border-teal-500/30 text-teal-100';
  if (lcat.includes('metalloid')) return 'bg-cyan-500/20 border-cyan-500/30 text-cyan-100';
  if (lcat.includes('halogen')) return 'bg-green-500/20 border-green-500/30 text-green-100';
  if (lcat.includes('noble gas')) return 'bg-blue-500/20 border-blue-500/30 text-blue-100';
  if (lcat.includes('lanthanide')) return 'bg-indigo-500/20 border-indigo-500/30 text-indigo-100';
  if (lcat.includes('actinide')) return 'bg-purple-500/20 border-purple-500/30 text-purple-100';
  if (lcat.includes('nonmetal')) return 'bg-lime-500/20 border-lime-500/30 text-lime-100';
  return 'bg-white/5 border-white/10 text-white/80';
};
