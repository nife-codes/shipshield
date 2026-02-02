import { Check,Circle } from "lucide-react";

const AnalysisSteps = ({ steps }) => (
  <div className="w-full space-y-4 mt-6">
    {steps.map((step, index) => (
      <div key={index} className={`flex items-start space-x-3 ${step.status === 'pending' ? 'opacity-50' : ''}`}>
        <div className="flex-shrink-0 mt-1">
          {step.status === 'done' && <div className="text-black text-lg bg-[#D1E7DD] p-1 items-center rounded"><Check width={20}/></div>}
          {step.status === 'running' && <div className="text-blue-500 text-lg p-1 bg-blue-200 items-center rounded"><Circle width={20}/></div>}
          {step.status === 'pending' && <div className="text-gray-400 text-lg p-1 bg-gray-200 items-center rounded" ><Circle width={20}/></div>}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
            {step.title}
          </p>
          {step.description && (
            <p className={`text-xs ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-600'}`}>
              {step.description}
            </p>
          )}
          <p className={`text-xs text-gray-500 mt-1`}>{step.time}</p>
        </div>
      </div>
    ))}
  </div>
);

export default AnalysisSteps;