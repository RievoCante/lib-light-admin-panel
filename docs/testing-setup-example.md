# Testing Setup: Step-by-Step Guide

## Step 1: Install Dependencies

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## Step 2: Create Vitest Config

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Step 3: Create Test Setup File

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Firebase globally
vi.mock('@/config/firebase', () => ({
  db: {},
  auth: {},
}));

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(() => new Date()),
  onSnapshot: vi.fn(),
  Timestamp: class {
    toDate() {
      return new Date();
    }
  },
}));

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));
```

## Step 4: Create Test Utilities

Create `src/test/test-utils.tsx`:

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Custom render with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## Step 5: Add Test Scripts to package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch"
  }
}
```

## Step 6: Create Your First Test

Create `src/services/__tests__/chatService.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getChatsQuery } from '../chatService';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';

describe('chatService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getChatsQuery', () => {
    it('should create a query for chats collection ordered by updatedAt desc', () => {
      const mockCollectionRef = {};
      const mockOrderBy = {};
      const mockQuery = {};

      vi.mocked(collection).mockReturnValue(mockCollectionRef as any);
      vi.mocked(orderBy).mockReturnValue(mockOrderBy as any);
      vi.mocked(query).mockReturnValue(mockQuery as any);

      const result = getChatsQuery();

      expect(collection).toHaveBeenCalledWith(db, 'chats');
      expect(orderBy).toHaveBeenCalledWith('updatedAt', 'desc');
      expect(query).toHaveBeenCalledWith(mockCollectionRef, mockOrderBy);
      expect(result).toBe(mockQuery);
    });

    it('should throw error if collection fails', () => {
      vi.mocked(collection).mockImplementation(() => {
        throw new Error('Firebase error');
      });

      expect(() => getChatsQuery()).toThrow('Failed to create chats query');
    });
  });
});
```

## Step 7: Run Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

---

## Example: Testing a Hook

Create `src/hooks/__tests__/useUserDisplayName.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserDisplayName } from '../useUserDisplayName';
import { useUser } from '../useUser';

// Mock useUser hook
vi.mock('../useUser');

describe('useUserDisplayName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return displayName when user exists', () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: '123', displayName: 'John Doe' },
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useUserDisplayName('123'));

    expect(result.current).toBe('John Doe');
  });

  it('should return null when user has no displayName', () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: '123' },
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useUserDisplayName('123'));

    expect(result.current).toBeNull();
  });

  it('should return null when user is null', () => {
    vi.mocked(useUser).mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useUserDisplayName('123'));

    expect(result.current).toBeNull();
  });
});
```

---

## Example: Testing a Component

Create `src/pages/__tests__/Login.test.tsx`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/test/test-utils';
import { Login } from '../Login';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
vi.mock('firebase/auth');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Login', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('should render login form', () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should submit form and navigate on success', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as any);

    render(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/chats');
    });
  });

  it('should display error on authentication failure', async () => {
    const user = userEvent.setup();
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue({
      code: 'auth/invalid-credential',
    });

    render(<Login />);

    await user.type(screen.getByLabelText(/email/i), 'wrong@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});
```

---

## Common Patterns

### Mocking Firebase Timestamps

```typescript
import { Timestamp } from 'firebase/firestore';

const mockTimestamp = {
  toDate: () => new Date('2024-01-01'),
  seconds: 1704067200,
  nanoseconds: 0,
} as Timestamp;
```

### Testing Async Hooks

```typescript
import { waitFor } from '@testing-library/react';

const { result } = renderHook(() => useChats());

await waitFor(() => {
  expect(result.current.loading).toBe(false);
});

expect(result.current.chats).toHaveLength(1);
```

### Testing Error States

```typescript
it('should handle errors', async () => {
  vi.mocked(getDoc).mockRejectedValue(new Error('Network error'));

  const { result } = renderHook(() => useUser('123'));

  await waitFor(() => {
    expect(result.current.error).toBeTruthy();
  });
});
```

---

## Next Steps

1. Start with one service test
2. Add one hook test
3. Add one component test
4. Gradually increase coverage
5. Focus on critical paths first
