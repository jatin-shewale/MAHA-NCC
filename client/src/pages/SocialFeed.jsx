import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Share2, 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  Plus, 
  X, 
  Image as ImageIcon,
  Award,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SocialFeed = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', category: 'Achievement', images: [] });

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/social/feed`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      toast.error('Failed to sync intelligence feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeed(); }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/social/post`, newPost, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Achievement transmitted. Awaiting ANO verification.');
      setShowCreate(false);
      setNewPost({ content: '', category: 'Achievement', images: [] });
    } catch (err) {
      toast.error('Transmission failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-orbitron font-bold text-white uppercase tracking-tight">Social Achievement Network</h1>
          <p className="text-xs text-slate-500 font-poppins uppercase tracking-widest">Global Unit Feed | Operational</p>
        </div>
        {user?.role === 'cadet' && (
          <button 
            onClick={() => setShowCreate(true)}
            className="military-btn flex items-center gap-2 text-sm px-5"
          >
            <Plus size={18} /> BROADCAST ACHIEVEMENT
          </button>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div 
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-gold/20 rounded-full border border-accent-gold/30 flex items-center justify-center">
                      <img src={post.user.avatar || `https://ui-avatars.com/api/?name=${post.user.name}&background=D4AF37&color=0A192F`} className="rounded-full" alt="" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-orbitron font-bold text-sm text-white uppercase">{post.user.name}</h4>
                        <CheckCircle2 size={14} className="text-accent-gold" />
                      </div>
                      <p className="text-[10px] text-slate-500 font-poppins uppercase tracking-widest">
                        {post.user.rank} | {post.user.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-orbitron text-accent-gold uppercase tracking-widest">
                      {post.category}
                    </span>
                    <MoreVertical size={18} className="text-slate-600" />
                  </div>
                </div>

                {/* Content */}
                <p className="text-slate-300 font-poppins text-sm leading-relaxed">
                  {post.content}
                </p>

                {/* Images Placeholder */}
                {post.images?.length > 0 && (
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <img src={post.images[0]} className="w-full h-64 object-cover grayscale contrast-125" alt="Achievement" />
                  </div>
                )}

                {/* Interactions */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-accent-gold transition-colors">
                    <ThumbsUp size={18} />
                    <span className="text-xs font-orbitron">{post.likes?.length || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-accent-gold transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-xs font-orbitron">{post.comments?.length || 0}</span>
                  </button>
                  <button className="ml-auto text-slate-500 hover:text-white transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Post Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-navy/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-xl p-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-tight">Broadcast Achievement</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">Intelligence Content</label>
                <textarea 
                  required
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-accent-gold/50 transition-all font-poppins min-h-[150px]"
                  placeholder="Describe your achievement, camp participation, or service milestone..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">Classification</label>
                  <select 
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none text-xs font-orbitron"
                  >
                    <option>Achievement</option>
                    <option>Camp</option>
                    <option>Drill</option>
                    <option>Community Service</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest">Visual Evidence</label>
                  <button type="button" className="w-full h-10 border border-dashed border-white/20 rounded-lg flex items-center justify-center gap-2 text-slate-500 hover:border-accent-gold/50 hover:text-accent-gold transition-all text-xs font-orbitron">
                    <ImageIcon size={16} /> UPLOAD MEDIA
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full military-btn py-4 flex items-center justify-center gap-2 group">
                TRANSMIT TO COMMAND <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
