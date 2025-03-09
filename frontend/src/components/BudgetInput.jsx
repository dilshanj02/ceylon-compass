const BudgetInput = ({ budget, setBudget }) => {
  return (
    <fieldset className="relative">
      <legend className="text-sm font-semibold text-gray-600 pl-4">
        Budget
      </legend>
      <div className="relative">
        {/* Budget input */}
        <input
          className="input input-bordered w-full rounded-full focus:outline-none"
          placeholder="Enter budget"
          value={budget ? Number(budget).toLocaleString() : ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
            setBudget(value);
          }}
        />
      </div>
    </fieldset>
  );
};

export default BudgetInput;
