import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, XCircle, Clock, Eye, Check, X, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ModerationPortal = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/social/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingPosts(res.data);
    } catch (err) {
      toast.error('Failed to access moderation intelligence.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleModerate = async (postId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/social/moderate`, { postId, status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Achievement ${status === 'approved' ? 'Verified' : 'Rejected'}.`);
      setPendingPosts(pendingPosts.filter(p => p._id !== postId));
      setSelectedPost(null);
    } catch (err) {
      toast.error('Command execution failed.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-orbitron font-bold text-white uppercase tracking-tight">Intelligence Moderation Portal</h1>
          <p className="text-xs text-slate-500 font-poppins uppercase tracking-widest">Awaiting Command Verification | {pendingPosts.length} Pending</p>
        </div>
      </div>

      {pendingPosts.length === 0 ? (
        <div className="glass-card p-20 flex flex-col items-center justify-center space-y-4 border-dashed border-white/5">
          <ShieldCheck size={60} className="text-slate-800" />
          <p className="font-orbitron text-slate-600 uppercase tracking-widest">No pending achievement transmissions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {pendingPosts.map((post) => (
              <motion.div 
                key={post._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card flex flex-col h-full"
              >
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-gold/10 rounded-full flex items-center justify-center">
                      <ShieldAlert className="text-accent-gold" size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-orbitron text-white uppercase">{post.user.name}</h4>
                      <p className="text-[10px] text-slate-500 font-poppins uppercase">{post.user.rank} | {post.user.unit}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/50 rounded-lg border border-white/5 space-y-2">
                    <span className="text-[9px] font-orbitron text-accent-gold uppercase tracking-widest">Raw Transmission</span>
                    <p className="text-xs text-slate-300 font-poppins line-clamp-3 italic">"{post.content}"</p>
                  </div>

                  {post.images?.length > 0 && (
                    <div className="aspect-video rounded-lg overflow-hidden border border-white/10 relative group">
                      <img src={post.images[0]} className="w-full h-full object-cover" alt="" />
                      <button 
                        onClick={() => setSelectedPost(post)}
                        className="absolute inset-0 bg-primary-navy/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Eye className="text-white" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 border-t border-white/10">
                  <button 
                    onClick={() => handleModerate(post._id, 'rejected')}
                    className="p-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 transition-colors border-r border-white/10"
                  >
                    <X size={18} /> <span className="text-[10px] font-orbitron font-bold">REJECT</span>
                  </button>
                  <button 
                    onClick={() => handleModerate(post._id, 'approved')}
                    className="p-4 flex items-center justify-center gap-2 text-green-500 hover:bg-green-500/10 transition-colors"
                  >
                    <Check size={18} /> <span className="text-[10px] font-orbitron font-bold">APPROVE</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-navy/90 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-orbitron text-accent-gold uppercase">Intel Evidence Inspection</span>
              <button onClick={() => setSelectedPost(null)} className="text-slate-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <img src={selectedPost.images[0]} className="w-full rounded-2xl border border-white/10" alt="" />
              <div className="space-y-4">
                <h3 className="font-orbitron font-bold text-white uppercase tracking-tight">{selectedPost.user.name}'s Achievement</h3>
                <p className="text-slate-400 font-poppins leading-relaxed">{selectedPost.content}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ModerationPortal;
