import { useState, useEffect } from "react";
import axios from "../utils/useAxios";

const ThemeInput = ({ theme, setTheme, validationErrors }) => {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/themes/")
      .then((res) => {
        setThemes(res.data);
        // Auto-select the first theme if none is selected
        if (!theme && res.data.length > 0) {
          setTheme({ id: res.data[0].id, name: res.data[0].name }); // includes name
        }
      })
      .catch((err) => {
        console.error("Failed to fetch themes:", err);
        setThemes([]);
      });
  }, []);

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-600 pl-4">
        Theme
      </legend>

      <select
        className="select select-bordered w-full rounded-full focus:outline-none"
        value={theme}
        onChange={(e) => {
          const selected = themes.find(
            (t) => t.id === parseInt(e.target.value)
          );
          if (selected) {
            setTheme({ id: selected.id, name: selected.name });
          }
        }}
      >
        <option disabled value="">
          Select a theme
        </option>
        {themes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {validationErrors.theme && (
        <p className="text-red-500 text-xs mt-1 pl-4">
          {validationErrors.theme}
        </p>
      )}
    </fieldset>
  );
};

export default ThemeInput;
