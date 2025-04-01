import React, { useState, useRef } from 'react';

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: {
    name?: string;
    profilePhoto?: File;
    coverPhoto?: File;
  }) => void;
  initialData?: {
    name: string;
    profilePhotoUrl?: string;
    coverPhotoUrl?: string;
  }; 
  isUpdating: boolean;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  initialData,
  isUpdating
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState(initialData?.profilePhotoUrl);
  const [coverPreview, setCoverPreview] = useState(initialData?.coverPhotoUrl);

  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'cover'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfilePhoto(file);
          setProfilePreview(reader.result as string);
        } else {
          setCoverPhoto(file);
          setCoverPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      name: name || undefined,
      profilePhoto: profilePhoto || undefined,
      coverPhoto: coverPhoto || undefined,
    });
 
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      ref={modalRef}
      onClick={handleBackdropClick}
    >
      <div className="bg-secondaryColor rounded-xl w-[90%] max-w-md p-8 max-h-[90vh] overflow-y-auto border border-purple-500/20 shadow-2xl shadow-purple-500/20 animate-slideUp">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent">
            Update Profile
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-purple-500 text-2xl font-semibold transition-colors duration-200"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Input */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-primaryColor border border-gray-700 rounded-lg shadow-sm 
                       text-white placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200"
              placeholder="Enter your name"
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Profile Photo
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {/* Current Profile Photo */}
                {initialData?.profilePhotoUrl && (
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-500/50 ring-offset-2 ring-offset-gray-900">
                      <img
                        src={initialData.profilePhotoUrl}
                        alt="Current profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-400">Current</span>
                  </div>
                )}
                
                {/* New Profile Preview */}
                {profilePreview && profilePreview !== initialData?.profilePhotoUrl && (
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-purple-500/50 ring-offset-2 ring-offset-gray-900">
                      <img
                        src={profilePreview}
                        alt="New profile preview"
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-purple-400">New</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e, 'profile')}
                className="w-full text-sm text-gray-400
                          file:mr-4  file:py-2 file:px-4 file:rounded-full
                          file:border-0 file:text-sm file:font-semibold
                          file:bg-purple-500/10 file:text-purple-400
                          hover:file:bg-purple-500/20
                          transition-all duration-200 "
              />
            </div>
          </div>

          {/* Cover Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover Photo
            </label>
            <div className="space-y-4">
              {/* Current Cover Photo */}
              {initialData?.coverPhotoUrl && (
                <div className="relative">
                  <div className="w-full h-32 rounded-xl overflow-hidden ring-2 ring-gray-500/50">
                    <img
                      src={initialData.coverPhotoUrl}
                      alt="Current cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">Current</span>
                </div>
              )}
              
              {/* New Cover Preview */}
              {coverPreview && coverPreview !== initialData?.coverPhotoUrl && (
                <div className="relative mt-8">
                  <div className="w-full h-32 rounded-xl overflow-hidden ring-2 ring-purple-500/50">
                    <img
                      src={coverPreview}
                      alt="New cover preview"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-purple-400">New</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e, 'cover')}
                className="w-full  text-sm text-gray-400
                          file:mr-4 file:py-2 file:px-4 file:rounded-full
                          file:border-0 file:text-sm file:font-semibold
                          file:bg-purple-500/10 file:text-purple-400
                          hover:file:bg-purple-500/20
                          transition-all duration-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 
                       rounded-lg hover:bg-gray-700 focus:outline-none 
                       focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900
                       transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className={`px-6 py-2.5 text-sm font-medium text-white 
                       bg-gradient-to-r from-purple-600 to-purple-800
                       rounded-lg hover:from-purple-700 hover:to-purple-900
                       focus:outline-none focus:ring-2 focus:ring-purple-500 
                       focus:ring-offset-2 focus:ring-offset-gray-900
                       transform hover:-translate-y-0.5
                       transition-all duration-200 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;