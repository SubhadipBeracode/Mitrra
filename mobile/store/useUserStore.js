// import { create } from 'zustand';
// import { updateUserProfile, uploadAvatar } from '../api/auth';

// export const useUserStore = create((set) => ({
//   name: '',
//   email: '',
//   avatarUri: null,

//   setUser: (userData) =>
//     set({
//       name: userData.name || '',
//       email: userData.email || '',
//       avatarUri: userData.avatarUrl || null,
//     }),

//   updateProfile: async (updates) => {
//     try {
//       let avatarUrl = updates.avatarUri;

//       // Agar naya local photo select hua hai (file:// se shuru hota hai), pehle upload karo
//       if (updates.avatarUri && updates.avatarUri.startsWith('file://')) {
//         const uploadResult = await uploadAvatar(updates.avatarUri);
//         avatarUrl = uploadResult.avatarUrl;
//       }

//       const result = await updateUserProfile({ name: updates.name });

//       set({
//         name: result.name,
//         email: result.email,
//         avatarUri: avatarUrl || result.avatarUrl,
//       });

//       return { success: true };
//     } catch (error) {
//       // console.log(error.message);
      
//       return { success: false, error: error.message };
//     }
//   },
// }));

import { create } from 'zustand';
import { updateUserProfile, uploadAvatar } from '../api/auth';

export const useUserStore = create((set) => ({
  name: '',
  email: '',
  avatarUri: null,

  setUser: (userData) =>
    set({
      name: userData.name || '',
      email: userData.email || '',
      avatarUri: userData.avatarUrl || null,
    }),

updateProfile: async (updates) => {
  try {
    // Safety: agar kabhi avatarUri object ban jaye (purani state ki wajah se), sirf uri nikaal lo
    const avatarUriString =
      typeof updates.avatarUri === 'string' ? updates.avatarUri : updates.avatarUri?.uri || null;

    let avatarUrl = avatarUriString;

    if (avatarUriString && avatarUriString.startsWith('file://')) {
      const uploadResult = await uploadAvatar(avatarUriString);
      avatarUrl = uploadResult.avatarUrl;
    }

    const result = await updateUserProfile({ name: updates.name });

    set({
      name: result.name,
      email: result.email,
      avatarUri: avatarUrl || result.avatarUrl,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
},
}));