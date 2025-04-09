import React, { useState, useRef } from 'react';
import { FaUser, FaCamera, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const COLORS = [
  'bg-emerald-500', 'bg-blue-500', 'bg-purple-500',
  'bg-amber-500', 'bg-teal-500', 'bg-indigo-500',
  'bg-cyan-500', 'bg-violet-500', 'bg-sky-500',
  'bg-green-500', 'bg-yellow-500', 'bg-orange-500'
];

const Avatar = ({ user, account = true, className = '', onAvatarChange }) => {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const getInitials = () => {
    if (!user) return <FaUser className="text-white" />;
    
    const name = user.name || user.email || '';
    const initials = name
      .split(' ')
      .filter(part => part.length > 0)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('');

    return initials || <FaUser className="text-white" />;
  };

  const getColor = () => {
    if (!user) return COLORS[0];
    const uniqueId = user._id || user.email || Math.random().toString();
    const hash = Array.from(uniqueId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return COLORS[hash % COLORS.length];
  };

  const extractPublicId = (url) => {
    // Extract public_id from Cloudinary URL
    const matches = url.match(/upload\/(?:v\d+\/)?([^\.]+)/);
    return matches ? matches[1] : null;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, or WEBP images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      // If user has existing avatar, include its public_id for cleanup
      if (user?.avatar) {
        const publicId = extractPublicId(user.avatar);
        if (publicId) {
          formData.append('oldPublicId', publicId);
        }
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/users/avatar`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      onAvatarChange?.(response.data);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(
        error.response?.data?.error || 
        error.message || 
        'Failed to upload avatar'
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  if(!account){
    return(
        <div 
            className={`${className} relative inline-flex items-center justify-center overflow-hidden rounded-full`}
        >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || 'User avatar'}
            className="w-full h-full object-cover"
          />)
          : (
            <div
                className={`${getColor()} w-full h-full flex items-center justify-center text-white font-medium`}
            >
                <span className="select-none">{getInitials()}</span>
            </div>
          )}
        </div>
    )
  }

  return (
    <div 
      className={`${className} relative inline-flex items-center justify-center overflow-hidden rounded-full cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isUploading && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />

        {isUploading ? (
        <div className=" flex w-full h-full items-center justify-center bg-gray-800/40">
            <div className="">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
                <div className="text-[10px] mt-2 font-light text-center text-gray-300">{uploadProgress}%</div>
            </div>
        </div>
        ): user?.avatar ? (
        <>
          <img
            src={user.avatar}
            alt={user.name || 'User avatar'}
            className="w-full h-full object-cover"
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <FaCamera className="text-white text-xl" />
            </div>
          )}
        </>
      ) : (
        <div
          className={`${getColor()} w-full h-full flex items-center justify-center text-white font-medium`}
        >
          <span className="select-none">{getInitials()}</span>
          {isHovered && (
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <FaCamera className="text-white text-xl" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Avatar;