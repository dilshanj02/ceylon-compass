const ProgressIndicator = ({ activeStep }) => {
  const steps = ["Basic Information", "Preferences", "Review & Submit"];

  return (
    <div className="flex justify-between items-center mb-6">
      {steps.map((stepLabel, index) => (
        <div key={index} className="flex items-center w-full">
          <div className="flex flex-col items-center w-full">
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center z-10 
                ${
                  activeStep > index
                    ? "bg-red-400 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 ${
                  activeStep > index + 1 ? "bg-red-400" : "bg-gray-200"
                }`}
              />
            )}
            <div className="text-sm text-center mt-2">{stepLabel}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
