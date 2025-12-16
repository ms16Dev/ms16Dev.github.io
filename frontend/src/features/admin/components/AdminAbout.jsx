import { useState, useEffect } from 'react';
import { User, Trash2 } from 'lucide-react';
import { useAbout } from '../hooks/useAbout';
import { aboutSchema } from '../schemas';


const AdminAbout = () => {
  const {
    aboutData,
    technologies,
    fetchAboutData,
    updateAbout,
    addTechnology,
    deleteTechnology,
    notify,
  } = useAbout();

  /* ======================
     Local state
  ====================== */
  const [localAbout, setLocalAbout] = useState({
    name: '',
    occupation: '',
    title: '',
    description: '',
    social_links: '[]',
    avatar_image: null,
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [newTech, setNewTech] = useState({ title: '', image: null });

  /* Submit / loading states */
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [isAddingTech, setIsAddingTech] = useState(false);

  const [errors, setErrors] = useState({});


  /* ======================
     Effects
  ====================== */
  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  useEffect(() => {
    if (aboutData) {
      setLocalAbout({ ...aboutData, avatar_image: null });
    }
  }, [aboutData]);

  /* ======================
     Handlers
  ====================== */

const handleSaveAbout = async (e) => {
  e.preventDefault();
  if (isSavingAbout) return;

  // Validate entire form
  const validation = aboutSchema.safeParse({
    name: localAbout.name,
    occupation: localAbout.occupation,
    title: localAbout.title,
    description: localAbout.description,
    social_links: localAbout.social_links,
    avatar_image: avatarFile,
  });

  if (!validation.success) {
    // Map errors to fields
    const fieldErrors = {};
    validation.error.issues.forEach(issue => {
      const field = issue.path[0];
      fieldErrors[field] = issue.message;
    });
    setErrors(fieldErrors); // <- shows under input fields
    return; // stop submission
  }

  // Clear errors if valid
  setErrors({});

  setIsSavingAbout(true);

  try {
    const formData = new FormData();
    formData.append('name', localAbout.name);
    formData.append('occupation', localAbout.occupation);
    formData.append('title', localAbout.title);
    formData.append('description', localAbout.description);
    formData.append('social_links', localAbout.social_links);
    if (avatarFile) formData.append('avatar', avatarFile);

    await updateAbout(formData);
  } finally {
    setIsSavingAbout(false);
  }
};


  const handleAddTechnology = async (e) => {
    e.preventDefault();
    if (isAddingTech) return;

    if (!newTech.title || !newTech.image) {
      notify('Please provide both title and image.', 'warning');
      return;
    }

    setIsAddingTech(true);

    try {
      const formData = new FormData();
      formData.append('title', newTech.title);
      formData.append('image', newTech.image);

      const success = await addTechnology(formData);
      if (success) {
        setNewTech({ title: '', image: null });
        const fileInput = document.getElementById('tech-image-input');
        if (fileInput) fileInput.value = '';
      }
    } finally {
      setIsAddingTech(false);
    }
  };


const validateField = (field, value) => {
  const nextState = {
    ...localAbout,
    [field]: value,
  };

  const result = aboutSchema.safeParse(nextState);

  if (result.success) {
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    return;
  }

  const issue = result.error.issues.find(
    issue => issue.path.length && issue.path[0] === field
  );

  setErrors(prev => ({
    ...prev,
    [field]: issue ? issue.message : undefined,
  }));
};



  /* ======================
     Classes
  ====================== */
  const inputClass =
    'w-full bg-surface border border-accent rounded-xl p-3 text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all backdrop-blur-sm';

  const labelClass =
    'block text-sm font-medium mb-2 text-accent';

  const buttonBase =
    'text-white font-bold rounded-xl shadow-lg transition-all';

  /* ======================
     Render
  ====================== */
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ================= About Form ================= */}
      <form onSubmit={handleSaveAbout} className="space-y-6">
        <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
          <User size={32} /> Edit About Section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Name *</label>
            <input
              type="text"
              className={inputClass}
              value={localAbout.name || ''}
              onChange={(e) => {
                  const v = e.target.value;
                  setLocalAbout({ ...localAbout, name: v });
                  validateField('name', v);
                }}
              disabled={isSavingAbout}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className={labelClass}>Occupation *</label>
            <input
              type="text"
              className={inputClass}
              value={localAbout.occupation || ''}
              onChange={(e) =>
                setLocalAbout({
                  ...localAbout,
                  occupation: e.target.value,
                })
              }
              disabled={isSavingAbout}
            />
            {errors.occupation && <p className="text-sm text-red-500 mt-1">{errors.occupation}</p>}

          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              className={inputClass}
              value={localAbout.title || ''}
              onChange={(e) =>
                setLocalAbout({ ...localAbout, title: e.target.value })
              }
              disabled={isSavingAbout}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Description *</label>
            <textarea
              className={`${inputClass} h-32 resize-none`}
              value={localAbout.description || ''}
              onChange={(e) =>
                setLocalAbout({
                  ...localAbout,
                  description: e.target.value,
                })
              }
              disabled={isSavingAbout}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className={labelClass}>Avatar Image *</label>
            <input
              type="file"
              accept="image/*"
              className={inputClass}
              onChange={(e) => setAvatarFile(e.target.files[0])}
              disabled={isSavingAbout}
            />
            {errors.avatar_image && <p className="text-sm text-red-500 mt-1">{errors.avatar_image}</p>}


            {aboutData?.avatar_image && (
              <div className="mt-2">
                <p className="text-xs text-primary mb-1">
                  Current Avatar:
                </p>
                <img
                  src={`data:image/jpeg;base64,${aboutData.avatar_image}`}
                  alt="Current Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Social Links (JSON)</label>
            <textarea
              className={`${inputClass} h-32 font-mono text-xs resize-none`}
              value={localAbout.social_links || ''}
              onChange={(e) =>
                setLocalAbout({
                  ...localAbout,
                  social_links: e.target.value,
                })
              }
              placeholder='{"github": "...", "linkedin": "..."}'
              disabled={isSavingAbout}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSavingAbout}
          className={`
            ${buttonBase}
            px-8 py-3
            bg-secondary dark:bg-accent
            ${
              isSavingAbout
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:shadow-accent/25 hover:scale-105'
            }
          `}
        >
          {isSavingAbout ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      {/* ================= Technology Section ================= */}
      <div className="border-t border-white/20 pt-8">
        <h3 className="text-xl font-bold mb-6 text-secondary">
          Technology Experience
        </h3>

        <form
          onSubmit={handleAddTechnology}
          className="mb-8 bg-white/30 dark:bg-slate-800/30 p-6 rounded-2xl border border-white/20 dark:border-slate-700"
        >
          <h4 className="text-lg font-semibold mb-4 text-secondary">
            Add New Technology
          </h4>

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className={labelClass}>Tech Name</label>
              <input
                type="text"
                className={inputClass}
                value={newTech.title}
                onChange={(e) =>
                  setNewTech({ ...newTech, title: e.target.value })
                }
                placeholder="e.g. React"
                disabled={isAddingTech}
              />
            </div>

            <div className="flex-1 w-full">
              <label className={labelClass}>Icon/Image</label>
              <input
                id="tech-image-input"
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(e) =>
                  setNewTech({
                    ...newTech,
                    image: e.target.files[0],
                  })
                }
                disabled={isAddingTech}
              />
            </div>

            <button
              type="submit"
              disabled={isAddingTech}
              className={`
                ${buttonBase}
                px-6 py-3
                bg-secondary dark:bg-accent
                ${
                  isAddingTech
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:shadow-accent/25 hover:scale-105'
                }
              `}
            >
              {isAddingTech ? 'Adding…' : 'Add'}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="bg-white/40 dark:bg-slate-800/40 p-4 rounded-xl border border-white/20 dark:border-slate-700 flex flex-col items-center gap-3 hover:bg-white/20 transition-colors relative group"
            >
              {tech.image && (
                <img
                  src={`data:image/jpeg;base64,${tech.image}`}
                  alt={tech.title}
                  className="w-12 h-12 object-contain"
                />
              )}

              <span className="font-medium text-slate-800 dark:text-slate-200">
                {tech.title}
              </span>

              <button
                onClick={() => deleteTechnology(tech.id)}
                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700 bg-white dark:bg-slate-900 rounded-full p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;
