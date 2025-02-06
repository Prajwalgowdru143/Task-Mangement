import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import TaskModal from './TaskModal';
import {Edit2, Trash2 } from 'lucide-react'

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks(localStorage.getItem('token'), filters);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await api.createTask(localStorage.getItem('token'), taskData);
      fetchTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await api.updateTask(localStorage.getItem('token'), taskId, updates);
      fetchTasks();
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(localStorage.getItem('token'), taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
        >
          Add Task
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Search tasks..."
          className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
        <select
          className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
        </select>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.filter(task => task.title.toLowerCase().includes(filters.search.toLowerCase())).map((task) => (
          <div
            key={task._id}
            className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  
                </button>
                <Edit2 className='w-4 h-4'/>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-600 hover:text-red-800"
                >
                 <Trash2 className='w-4 h-4'/>
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{task.description}</p>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-sm ${
                task.status === 'completed' 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-yellow-200 text-yellow-800'
              }`}>
                {task.status}
              </span>
              <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                {task.category}
              </span>
            </div>
            {task.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-300 text-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
      />
    </div>
  );
}
