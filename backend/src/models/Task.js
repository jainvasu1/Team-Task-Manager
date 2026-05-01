import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

taskSchema.virtual('isOverdue').get(function () {
  return this.dueDate && this.status !== 'done' && this.dueDate < new Date();
});

taskSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Task', taskSchema);
