import { useEffect } from "react";

const ThemeInput = ({ theme, setTheme, validationErrors }) => {
  useEffect(() => {
    if (!theme) {
      setTheme("Adventure & Outdoors"); // Default theme
    }
  }, [theme]);

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-600 pl-4">
        Theme
      </legend>
      <select
        className="select select-bordered w-full rounded-full focus:outline-none"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option disabled>Select a theme</option>
        <option>Adventure & Outdoors</option>
        <option>Leisure & Relaxation</option>
        <option>Culture & Heritage</option>
      </select>
    </fieldset>
  );
};

export default ThemeInput;
