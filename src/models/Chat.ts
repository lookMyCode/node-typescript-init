import * as mongoose from 'mongoose';


const chatSchema = new mongoose.Schema({
  chatId: {
    type: Number, 
    required: true,
  },
  lang: {
    type: String, 
    required: true,
  },
  stage: {
    type: String, 
    required: true,
  }
}, {
  timestamps: true
});

export const ChatModel = mongoose.model('chat', chatSchema);