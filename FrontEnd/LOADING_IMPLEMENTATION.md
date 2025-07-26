# Loading States Implementation Guide

## Tổng quan

Đã thêm hiệu ứng loading cho các button và form trong các luồng chính của ứng dụng:

### 1. Login Form (`src/components/login/LoginForm.jsx`)

- ✅ Loading cho button "Sign In"
- ✅ Loading cho Google Login
- ✅ Disable form fields khi đang loading
- ✅ Loading spinner với text "Đang đăng nhập..."

### 2. Vaccination Events (`src/pages/Manager/VaccinationEvents.jsx`)

- ✅ Loading cho Create Event
- ✅ Loading cho Edit Event
- ✅ Loading cho Delete Event
- ✅ Loading cho Send Email
- ✅ Disable buttons khi đang loading
- ✅ Loading text: "Đang tạo...", "Đang cập nhật...", "Đang xóa...", "Đang gửi..."

### 3. Blog Management (`src/pages/Manager/BlogManagement.jsx`)

- ✅ Loading cho Create Blog
- ✅ Loading cho Update Blog
- ✅ Loading cho Delete Blog
- ✅ Loading cho Approve/Reject Blog
- ✅ Disable form fields và buttons khi loading

### 4. Handle Medicine (`src/pages/Nurse/HandleMedicine.jsx`)

- ✅ Loading cho Submit Form
- ✅ Loading cho Process Submission
- ✅ Disable buttons khi đang loading

### 5. Notifications (`src/pages/Manager/Notifications.jsx`)

- ✅ Loading cho Send Notification (đã có sẵn)
- ✅ Disable form khi đang loading

## Components Tái Sử Dụng

### LoadingSpinner Component

```jsx
import LoadingSpinner from '../components/common/LoadingSpinner';

// Sử dụng
<LoadingSpinner size="medium" color="#2f5148" text="Đang tải..." />;
```

### LoadingButton Component

```jsx
import LoadingButton from '../components/common/LoadingButton';

// Sử dụng
<LoadingButton
  loading={isLoading}
  loadingText="Đang xử lý..."
  variant="primary"
  size="medium"
>
  Submit
</LoadingButton>;
```

### useLoading Hook

```jsx
import useLoading from '../utils/hooks/useLoading';

const { startLoading, stopLoading, withLoading, isLoading } = useLoading({
  submit: false,
  delete: false,
  approve: false,
});

// Sử dụng
const handleSubmit = async () => {
  await withLoading('submit', async () => {
    // API call
  });
};
```

## CSS Classes

### Loading Spinner

```css
.loading-spinner {
  animation: spin 1s linear infinite;
}
```

### Disabled Button States

```css
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #c1cbc2 !important;
  color: #97a19b !important;
}
```

### Loading Text

```css
.loading-text {
  font-weight: 500;
  letter-spacing: 0.5px;
}
```

## Pattern Sử Dụng

### 1. State Management

```jsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    // API call
  } finally {
    setIsLoading(false);
  }
};
```

### 2. Button với Loading

```jsx
<button disabled={isLoading} className="submit-btn">
  {isLoading ? (
    <>
      <span className="loading-spinner">⏳</span>
      Đang xử lý...
    </>
  ) : (
    'Submit'
  )}
</button>
```

### 3. Form Fields Disabled

```jsx
<input
  disabled={isLoading}
  // ... other props
/>
```

## Các Trang Đã Implement

### ✅ Completed

- Login Form
- Vaccination Events (Manager)
- Blog Management (Manager)
- Handle Medicine (Nurse)
- Notifications (Manager)

### 🔄 Next Steps

- Medicine Request (Parent)
- Review Requests (Nurse)
- Account Management (Manager/Admin)
- Student List operations
- Health Record operations

## Best Practices

1. **Always disable form fields** khi đang loading
2. **Show loading text** thay vì chỉ spinner
3. **Use try/finally** để đảm bảo loading state được reset
4. **Consistent styling** với theme colors
5. **Accessibility** - screen readers có thể đọc loading text

## Theme Colors

- Primary: `#2f5148` (Dark Green)
- Secondary: `#73ad67` (Light Green)
- Accent: `#bfefa1` (Very Light Green)
- Disabled: `#c1cbc2` (Gray)
- Text Secondary: `#97a19b` (Gray)
