import { useRef, useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { settingsSchema } from '../schemas';


const AdminSettings = () => {
  const { settings, fetchSettings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState({ calendar_start_year: 2020, calendar_end_year: 2030 });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchSettings();
      hasFetched.current = true;
    }
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const validateField = (field, value) => {
    const nextState = { ...localSettings, [field]: value };
    const result = settingsSchema.safeParse(nextState);

    if (result.success) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      return;
    }

    const issue = result.error.issues.find(i => i.path[0] === field);
    setErrors(prev => ({
      ...prev,
      [field]: issue ? issue.message : undefined,
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validation = settingsSchema.safeParse(localSettings);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await updateSettings(localSettings);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm";
  const labelClass = "block text-sm font-medium mb-2 text-accent";

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
        <Settings size={32} /> Calendar Settings
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Start Year</label>
          <input
            type="number"
            className={inputClass}
            value={localSettings.calendar_start_year}
            onChange={e => {
              const val = parseInt(e.target.value);
              setLocalSettings({ ...localSettings, calendar_start_year: val });
              validateField('calendar_start_year', val);
              validateField('calendar_end_year', localSettings.calendar_end_year); // re-validate end year
            }}
          />
          {errors.calendar_start_year && (
            <p className="text-sm text-red-500 mt-1">{errors.calendar_start_year}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>End Year</label>
          <input
            type="number"
            className={inputClass}
            value={localSettings.calendar_end_year}
            onChange={e => {
              const val = parseInt(e.target.value);
              setLocalSettings({ ...localSettings, calendar_end_year: val });
              validateField('calendar_end_year', val);
              validateField('calendar_start_year', localSettings.calendar_start_year); // re-validate start year
            }}
          />
          {errors.calendar_end_year && (
            <p className="text-sm text-red-500 mt-1">{errors.calendar_end_year}</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto bg-secondary dark:bg-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-accent/25 hover:scale-105 transition-all disabled:opacity-50"
      >
        {isSubmitting ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  );
};

export default AdminSettings;
