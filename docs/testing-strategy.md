# Testing Strategy Guide

## Testing Pyramid: What to Test and Why

```
        /\
       /E2E\          ← Few, Critical User Flows
      /------\
     /Integration\   ← Component + Hook Interactions
    /------------\
   /   Unit Tests  \  ← Many, Fast, Isolated
  /----------------\
```

### 1. **Unit Tests** (70% of tests) - Foundation Layer

**What to Test:**

- **Services** (`chatService.ts`, `messageService.ts`, `userService.ts`)
- **Utilities** (`auth.ts`, `utils.ts`)
- **Pure functions** (timestamp conversion, data transformation)
- **Type guards and validators**

**Why:**

- Fastest to write and run
- Highest ROI (Return on Investment)
- Catches bugs early
- Easy to maintain
- No external dependencies

**Example Priority:**

1. ✅ `convertTimestamp()` - Critical utility used everywhere
2. ✅ `getUser()` - Core data fetching logic
3. ✅ `isAuthenticated()` - Security-critical function
4. ✅ `getChatsQuery()` - Query building logic

---

### 2. **Integration Tests** (20% of tests) - Middle Layer

**What to Test:**

- **Custom Hooks** (`useChats`, `useMessages`, `useUser`)
- **Component + Hook interactions**
- **Firebase integration** (with mocks)
- **Error handling flows**

**Why:**

- Tests how pieces work together
- Catches integration bugs
- Validates real-world scenarios
- Ensures hooks handle edge cases

**Example Priority:**

1. ✅ `useChats` hook - Real-time listener behavior
2. ✅ `useUser` hook - User data fetching and updates
3. ✅ `ProtectedRoute` + Auth state
4. ✅ `Login` component + Firebase Auth

---

### 3. **Component Tests** (8% of tests) - UI Layer

**What to Test:**

- **User interactions** (clicks, form submissions)
- **Conditional rendering** (loading states, errors)
- **Props and state changes**
- **Accessibility** (a11y)

**Why:**

- Ensures UI works as expected
- Validates user experience
- Catches visual bugs
- Tests accessibility

**Example Priority:**

1. ✅ `Login` - Form submission, error handling
2. ✅ `ChatList` - Chat selection, empty states
3. ✅ `ChatConversation` - Message sending
4. ✅ `ProtectedRoute` - Redirect behavior

---

### 4. **E2E Tests** (2% of tests) - Critical Paths

**What to Test:**

- **Critical user journeys** (login → view chats → send message)
- **Authentication flows**
- **Data persistence**

**Why:**

- Tests complete user experience
- Catches system-wide issues
- Validates production-like scenarios
- Slow but high confidence

**Example Priority:**

1. ✅ Complete login flow
2. ✅ View chat list and select chat
3. ✅ Send message as admin
4. ✅ Logout flow

---

## What NOT to Test (Anti-Patterns)

### ❌ Don't Test:

1. **Third-party libraries** (Firebase SDK, React Router, TanStack Query)
   - They're already tested by their maintainers
   - Mock them instead

2. **Implementation details**
   - Don't test internal state variables
   - Test behavior, not implementation

3. **Styling/CSS**
   - Visual regression tests are separate
   - Don't test Tailwind classes

4. **TypeScript types**
   - Type checking is handled by `tsc`
   - No need for runtime type tests

---

## Testing Tools & Setup

### Recommended Stack:

```json
{
  "devDependencies": {
    "vitest": "^1.0.0", // Fast test runner (Vite-native)
    "@testing-library/react": "^14.0.0", // Component testing
    "@testing-library/jest-dom": "^6.0.0", // DOM matchers
    "@testing-library/user-event": "^14.0.0", // User interactions
    "@vitest/ui": "^1.0.0", // Test UI
    "msw": "^2.0.0", // Mock Service Worker (API mocking)
    "firebase-mock": "^0.0.1" // Firebase mocking (or custom mocks)
  }
}
```

**Why Vitest?**

- Native Vite integration (same config)
- Fast (ESM support)
- Jest-compatible API
- Great TypeScript support

---

## Testing Priorities by Risk

### 🔴 **Critical (Test First)**

1. **Authentication** (`auth.ts`, `Login.tsx`)
   - Security vulnerability if broken
   - Users can't access the app

2. **Data Fetching** (`useChats`, `useMessages`, `useUser`)
   - Core functionality
   - Real-time updates are complex

3. **Error Handling** (All hooks/services)
   - Poor UX if broken
   - App crashes if not handled

### 🟡 **Important (Test Second)**

4. **Message Sending** (`sendAdminMessage`)
   - Core feature
   - Data integrity critical

5. **Route Protection** (`ProtectedRoute`)
   - Security concern
   - Prevents unauthorized access

### 🟢 **Nice to Have (Test Later)**

6. **UI Components** (Styling, animations)
7. **Edge Cases** (Empty states, long lists)
8. **Performance** (Large datasets)

---

## Practical Examples

### Example 1: Unit Test - Service Function

```typescript
// src/services/__tests__/chatService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getChatsQuery } from '../chatService';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Mock Firebase
vi.mock('@/config/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
}));

describe('chatService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create query with correct collection and ordering', () => {
    const chatsRef = {};
    collection.mockReturnValue(chatsRef);
    orderBy.mockReturnValue('orderBy');
    query.mockReturnValue('query');

    const result = getChatsQuery();

    expect(collection).toHaveBeenCalledWith(db, 'chats');
    expect(orderBy).toHaveBeenCalledWith('updatedAt', 'desc');
    expect(query).toHaveBeenCalledWith(chatsRef, 'orderBy');
  });

  it('should handle errors gracefully', () => {
    collection.mockImplementation(() => {
      throw new Error('Firebase error');
    });

    expect(() => getChatsQuery()).toThrow('Failed to create chats query');
  });
});
```

**Why this test:**

- ✅ Tests the function's behavior
- ✅ Validates correct Firebase calls
- ✅ Tests error handling
- ✅ Fast and isolated

---

### Example 2: Integration Test - Custom Hook

```typescript
// src/hooks/__tests__/useChats.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useChats } from '../useChats';
import { onSnapshot } from 'firebase/firestore';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  onSnapshot: vi.fn(),
  QuerySnapshot: class {},
}));

vi.mock('@/services/chatService', () => ({
  getChatsQuery: vi.fn(() => 'mock-query'),
  convertTimestamp: vi.fn(ts => new Date(ts)),
}));

describe('useChats', () => {
  let unsubscribe: () => void;

  beforeEach(() => {
    unsubscribe = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    onSnapshot.mockImplementation((query, callback, errorCallback) => {
      // Don't call callback yet
      return unsubscribe;
    });

    const { result } = renderHook(() => useChats());

    expect(result.current.loading).toBe(true);
    expect(result.current.chats).toEqual([]);
  });

  it('should update chats when snapshot changes', async () => {
    const mockChats = [
      {
        id: 'chat1',
        data: () => ({
          userId: 'user1',
          createdAt: { toDate: () => new Date() },
          updatedAt: { toDate: () => new Date() },
        }),
      },
    ];

    onSnapshot.mockImplementation((query, callback) => {
      setTimeout(() => {
        callback({
          docs: mockChats,
        });
      }, 0);
      return unsubscribe;
    });

    const { result } = renderHook(() => useChats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.chats).toHaveLength(1);
    expect(result.current.chats[0].id).toBe('chat1');
  });

  it('should handle errors', async () => {
    const error = new Error('Firebase error');

    onSnapshot.mockImplementation((query, callback, errorCallback) => {
      setTimeout(() => {
        errorCallback(error);
      }, 0);
      return unsubscribe;
    });

    const { result } = renderHook(() => useChats());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('Failed to fetch chats');
  });

  it('should cleanup subscription on unmount', () => {
    onSnapshot.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useChats());

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
```

**Why this test:**

- ✅ Tests real-time listener behavior
- ✅ Validates loading states
- ✅ Tests error handling
- ✅ Ensures cleanup (memory leak prevention)

---

### Example 3: Component Test - Login Form

```typescript
// src/pages/__tests__/Login.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../Login';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
}));

vi.mock('@/config/firebase', () => ({
  auth: {},
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    renderLogin();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should submit form with email and password', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockResolvedValue({});

    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'admin@example.com',
        'password123'
      );
    });
  });

  it('should display error on invalid credentials', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockRejectedValue({
      code: 'auth/invalid-credential',
    });

    renderLogin();

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('should disable form while loading', async () => {
    const user = userEvent.setup();
    signInWithEmailAndPassword.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderLogin();

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
  });
});
```

**Why this test:**

- ✅ Tests user interactions
- ✅ Validates form behavior
- ✅ Tests error states
- ✅ Tests loading states

---

## Testing Best Practices

### 1. **AAA Pattern** (Arrange, Act, Assert)

```typescript
it('should do something', () => {
  // Arrange: Set up test data
  const input = 'test';

  // Act: Execute the function
  const result = functionToTest(input);

  // Assert: Verify the result
  expect(result).toBe('expected');
});
```

### 2. **Test Behavior, Not Implementation**

```typescript
// ❌ Bad: Testing implementation
expect(component.state.count).toBe(1);

// ✅ Good: Testing behavior
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

### 3. **Use Descriptive Test Names**

```typescript
// ❌ Bad
it('test 1', () => {});

// ✅ Good
it('should display error message when Firebase authentication fails', () => {});
```

### 4. **One Assertion Per Test (When Possible)**

```typescript
// ❌ Bad: Multiple concerns
it('should handle login', () => {
  expect(login).toBeCalled();
  expect(redirect).toBeCalled();
  expect(error).toBeNull();
});

// ✅ Good: Focused tests
it('should call signInWithEmailAndPassword on form submit', () => {});
it('should redirect to /chats on successful login', () => {});
it('should display error on authentication failure', () => {});
```

### 5. **Mock External Dependencies**

```typescript
// Always mock Firebase, APIs, etc.
vi.mock('firebase/firestore');
vi.mock('@/config/firebase');
```

### 6. **Test Edge Cases**

- Empty data
- Error states
- Loading states
- Null/undefined values
- Network failures

---

## Coverage Goals

### Minimum Coverage Targets:

- **Services**: 80%+ (critical business logic)
- **Hooks**: 70%+ (complex state management)
- **Components**: 60%+ (user interactions)
- **Utilities**: 90%+ (pure functions)

### Don't Obsess Over 100%

- Focus on **meaningful** tests
- Test **critical paths** first
- **Quality > Quantity**

---

## CI/CD Integration

Add to `.github/workflows/ci.yml`:

```yaml
- name: Run tests
  run: npm run test

- name: Generate coverage report
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

---

## Getting Started Checklist

1. ✅ Install testing dependencies
2. ✅ Configure Vitest (`vitest.config.ts`)
3. ✅ Set up test utilities (`src/test-utils.tsx`)
4. ✅ Write first unit test (service function)
5. ✅ Write first integration test (hook)
6. ✅ Write first component test (Login)
7. ✅ Add test scripts to `package.json`
8. ✅ Integrate with CI/CD

---

## Summary: Testing Priorities

### Start Here (Week 1):

1. **Services** - `chatService`, `userService`, `messageService`
2. **Auth utilities** - `auth.ts`
3. **Timestamp conversion** - Critical utility

### Then (Week 2):

4. **Hooks** - `useChats`, `useMessages`, `useUser`
5. **Login component** - Critical user flow

### Finally (Week 3+):

6. **Other components** - ChatList, ChatConversation
7. **E2E tests** - Critical user journeys

---

## Key Takeaways

1. **Test the right things** - Focus on business logic and user flows
2. **Start small** - Unit tests first, then integration, then E2E
3. **Mock external dependencies** - Don't test third-party code
4. **Test behavior, not implementation** - Focus on what users see
5. **Maintain tests** - Keep them updated as code changes
6. **Quality over quantity** - Better to have fewer meaningful tests

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Firebase Testing Guide](https://firebase.google.com/docs/rules/unit-tests)
