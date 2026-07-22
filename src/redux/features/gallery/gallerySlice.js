// redux/features/gallery/gallerySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getGalleryImages,
  uploadGalleryImages,
  deleteGalleryImage,
  updateGalleryImage,
} from "../../../services/galleryServices"; // You'll create this service file

// Initial state
const initialState = {
  images: [],
  isLoading: false,
  isUploading: false,
  uploadProgress: 0,
  error: null,
  successMessage: null,
  totalCount: 0,
  hasMore: false,
  page: 1,
  limit: 20,
};

// Async Thunks
export const fetchGalleryImages = createAsyncThunk(
  "gallery/fetchImages",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await getGalleryImages(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch gallery"
      );
    }
  }
);

export const uploadGalleryImages = createAsyncThunk(
  "gallery/uploadImages",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await uploadGalleryImages(formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to upload images"
      );
    }
  }
);

export const deleteGalleryImageById = createAsyncThunk(
  "gallery/deleteImage",
  async (imageId, { rejectWithValue }) => {
    try {
      const response = await deleteGalleryImage(imageId);
      return { imageId, ...response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete image"
      );
    }
  }
);

export const updateGalleryImageDetails = createAsyncThunk(
  "gallery/updateImage",
  async ({ imageId, updateData }, { rejectWithValue }) => {
    try {
      const response = await updateGalleryImage(imageId, updateData);
      return { imageId, ...response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update image"
      );
    }
  }
);

// Gallery Slice
const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    resetGalleryState: (state) => {
      state.images = [];
      state.isLoading = false;
      state.isUploading = false;
      state.uploadProgress = 0;
      state.error = null;
      state.successMessage = null;
      state.totalCount = 0;
      state.hasMore = false;
      state.page = 1;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearGalleryError: (state) => {
      state.error = null;
    },
    clearGallerySuccess: (state) => {
      state.successMessage = null;
    },
    setGalleryPage: (state, action) => {
      state.page = action.payload;
    },
    resetUploadState: (state) => {
      state.isUploading = false;
      state.uploadProgress = 0;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Gallery Images
      .addCase(fetchGalleryImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGalleryImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload.data?.images || action.payload.data || [];
        state.totalCount = action.payload.total || action.payload.data?.length || 0;
        state.hasMore = action.payload.hasMore || false;
        state.page = action.payload.page || state.page;
      })
      .addCase(fetchGalleryImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load gallery";
      })

      // Upload Gallery Images
      .addCase(uploadGalleryImages.pending, (state) => {
        state.isUploading = true;
        state.uploadProgress = 0;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadGalleryImages.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 100;
        state.successMessage = action.payload.message || "Images uploaded successfully!";
        
        // Add new images to the beginning of the array
        const newImages = action.payload.data || action.payload.images || [];
        state.images = [...newImages, ...state.images];
        state.totalCount += newImages.length;
      })
      .addCase(uploadGalleryImages.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadProgress = 0;
        state.error = action.payload || "Failed to upload images";
      })

      // Delete Gallery Image
      .addCase(deleteGalleryImageById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGalleryImageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = state.images.filter(
          (image) => image.id !== action.payload.imageId && image._id !== action.payload.imageId
        );
        state.totalCount -= 1;
        state.successMessage = action.payload.message || "Image deleted successfully!";
      })
      .addCase(deleteGalleryImageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete image";
      })

      // Update Gallery Image
      .addCase(updateGalleryImageDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGalleryImageDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.images.findIndex(
          (image) => image.id === action.payload.imageId || image._id === action.payload.imageId
        );
        if (index !== -1) {
          state.images[index] = {
            ...state.images[index],
            ...action.payload.data,
            ...action.payload.image,
          };
        }
        state.successMessage = action.payload.message || "Image updated successfully!";
      })
      .addCase(updateGalleryImageDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update image";
      });
  },
});

// Export actions
export const {
  resetGalleryState,
  setUploadProgress,
  clearGalleryError,
  clearGallerySuccess,
  setGalleryPage,
  resetUploadState,
} = gallerySlice.actions;

// Selectors
export const selectGalleryImages = (state) => state.gallery.images;
export const selectGalleryLoading = (state) => state.gallery.isLoading;
export const selectGalleryUploading = (state) => state.gallery.isUploading;
export const selectUploadProgress = (state) => state.gallery.uploadProgress;
export const selectGalleryError = (state) => state.gallery.error;
export const selectGallerySuccess = (state) => state.gallery.successMessage;
export const selectGalleryTotalCount = (state) => state.gallery.totalCount;
export const selectGalleryHasMore = (state) => state.gallery.hasMore;
export const selectGalleryPage = (state) => state.gallery.page;

export default gallerySlice.reducer;