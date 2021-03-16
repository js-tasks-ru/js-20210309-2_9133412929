/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const picked = [];

  for (const [prop, value] of Object.entries(obj)) {
  	if (fields.includes(prop)) {
      picked.push([prop, value] );
    }
	}

  return Object.fromEntries(picked.map(([key, value]) => [key, value]));
};
