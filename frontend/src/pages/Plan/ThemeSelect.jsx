export default function ThemeSelect({ theme, setTheme }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-600 pl-4">What</legend>
      <select
        className="select select-bordered w-full rounded-full focus:outline-none"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option disabled>Select a theme</option>
        <option>Adventure</option>
        <option>Culture</option>
        <option>Relax</option>
      </select>
    </fieldset>
  );
}
