export const daysLeft = (deadline) => {
  const deadlineDate = new Date(deadline * 1000); 
  const today = new Date();
  
  const timeDiff = deadlineDate - today;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysRemaining >= 0 ? daysRemaining : 0;
};
