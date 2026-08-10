function validateTripInput(body) {
  const errors = [];
  const { destination, checkin, checkout, travelers, tripType, budget } = body || {};

  if (!destination || !destination.trim()) errors.push('Destination is required');
  if (!checkin) errors.push('Check-in date is required');
  if (!checkout) errors.push('Check-out date is required');

  if (checkin && checkout) {
    const nights = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
    if (!(nights > 0)) errors.push('Check-out must be after check-in');
    if (nights > 30) errors.push('Trips longer than 30 nights are not supported yet');
  }

  if (!travelers || travelers < 1) errors.push('At least 1 traveler is required');
  if (!tripType) errors.push('Trip type is required');
  if (!budget) errors.push('Budget tier is required');

  const VALID_BUDGETS = ['budget', 'standard', 'premium', 'luxury'];
  if (budget && !VALID_BUDGETS.includes(budget)) errors.push('Invalid budget tier');

  return errors;
}

module.exports = { validateTripInput };