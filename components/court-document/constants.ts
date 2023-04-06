export const MY_PLEADINGS = "my pleadings";
export const OPPOSITION_PLEADINGS = "opposition pleadings";
export const COURT_ORDERS = "court orders";

const CATEGORIES = [MY_PLEADINGS, OPPOSITION_PLEADINGS, COURT_ORDERS];

export const FILTER_OPTIONS = CATEGORIES.map((category) => ({
  value: category,
  name: category,
}));
