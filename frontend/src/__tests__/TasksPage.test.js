import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TasksPage from '../pages/TasksPage';
import { fetchTasks, fetchUsers, createTask } from '../services/api';

jest.mock('../services/api');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('TasksPage and TaskList Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tasks when TaskList fetches data on mount', async () => {
    const mockTaskResponse = {
      tasks: [
        { 
          id: '101', 
          title: 'Task from Mock', 
          description: 'Testing internal fetch', 
          status: 'PENDING',
          user: { name: 'John Doe' }
        }
      ]
    };

    fetchTasks.mockResolvedValue(mockTaskResponse);
    fetchUsers.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <TasksPage setToken={jest.fn()} />
      </BrowserRouter>
    );

    const taskTitle = await screen.findByText(/Task from Mock/i);
    expect(taskTitle).toBeInTheDocument();

    const userName = screen.getByText(/Assign to: John Doe/i);
    expect(userName).toBeInTheDocument();
    
    expect(fetchTasks).toHaveBeenCalled();
  });
});

describe('CreateTask Form Submission', () => {
  it('submits the form and calls createTask with correct data', async () => {
    
    fetchTasks.mockResolvedValue({ tasks: [] });
    fetchUsers.mockResolvedValue([
      { id: 'user-1', name: 'John Doe', email: 'john@example.com' }
    ]);
    createTask.mockResolvedValue({ id: 'new-task', title: 'Test Title' });

    render(
      <BrowserRouter>
        <TasksPage setToken={jest.fn()} />
      </BrowserRouter>
    );

    const userDropdown = await screen.findByRole('combobox');
    
   
    const titleInput = screen.getByPlaceholderText(/Title/i);
    const descInput = screen.getByPlaceholderText(/Description/i);
    const submitBtn = screen.getByRole('button', { name: /Add Task/i });

    fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
    fireEvent.change(descInput, { target: { value: 'New Task Description' } });
    fireEvent.change(userDropdown, { target: { value: 'user-1' } });

    
    fireEvent.click(submitBtn);

   
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith(
        'New Task Title',
        'New Task Description',
        'user-1'
      );
    });

    
    expect(titleInput.value).toBe('');
    expect(descInput.value).toBe('');
    expect(userDropdown.value).toBe('');
  });

  it('shows error message if fields are empty', async () => {
    fetchTasks.mockResolvedValue({ tasks: [] });
    fetchUsers.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <TasksPage setToken={jest.fn()} />
      </BrowserRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /Add Task/i });
    fireEvent.click(submitBtn);

    const errorMsg = await screen.findByText(/Title, description, and user are required/i);
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveStyle({ color: 'red' });
  });
});