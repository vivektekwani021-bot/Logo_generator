
// export default EditorPage;

//  CODE OF COPILOT 
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, IText, Circle, Rect, Triangle } from 'fabric';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import projectService from '../api/projectService';
import {
  FaUndo, FaRedo, FaTrash, FaArrowUp, FaArrowDown, FaFont, FaShapes,
  FaMousePointer, FaVectorSquare, FaCircle
} from 'react-icons/fa';
import { SketchPicker } from 'react-color';

// --- Helper Components ---
const ToolbarButton = ({ onClick, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="w-full p-3 flex items-center space-x-3 text-left text-sm text-gray-200 hover:bg-indigo-700 rounded-md transition-colors"
  >
    {children}
  </button>
);

const PropertyControl = ({ label, children }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

// --- Main Editor Component ---
const EditorPage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [projectName, setProjectName] = useState('Untitled Logo');
  const [activeObject, setActiveObject] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const googleFonts = [
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro',
  'Raleway', 'Merriweather', 'PT Sans', 'Playfair Display', 'Poppins', 'Nunito',
  'Quicksand', 'Bebas Neue', 'Pacifico', 'Arial', 'Verdana'
];

  // --- Core Canvas & History Logic ---

  const saveState = useCallback(() => {
    if (!canvas) return;
    const json = canvas.toJSON();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [canvas, history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      canvas.loadFromJSON(history[newIndex], () => canvas.renderAll());
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      canvas.loadFromJSON(history[newIndex], () => canvas.renderAll());
    }
  };

  // Effect 1: Initialize canvas ONCE on mount
  useEffect(() => {
    const initCanvas = new Canvas(canvasRef.current, {
      height: 600,
      width: 800,
      backgroundColor: '#1f2937',
    });
    setCanvas(initCanvas);

    const json = initCanvas.toJSON();
    setHistory([json]);
    setHistoryIndex(0);

    return () => {
      initCanvas.dispose();
    };
  }, []);

  // Effect 2: Set up and clean up event listeners
  useEffect(() => {
    if (!canvas) return;

    const handleSelectionCreated = (e) => setActiveObject(e.target);
    const handleSelectionUpdated = (e) => setActiveObject(e.target);
    const handleSelectionCleared = () => setActiveObject(null);

    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:modified', saveState);

    return () => {
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
      canvas.off('object:modified', saveState);
    };
  }, [canvas, saveState]);

  // Effect 3: Load project data
  useEffect(() => {
    if (projectId && projectId !== 'new' && canvas && user?.token) {
      projectService.getProject(projectId, user?.token)
        .then(data => {
          if (data) {
            setProjectName(data.name);
            canvas.loadFromJSON(data.designState, () => {
              canvas.renderAll();
              const json = canvas.toJSON();
              setHistory([json]);
              setHistoryIndex(0);
            });
          }
        })
        .catch(err => {
          console.error("Failed to load project", err);
          navigate('/dashboard');
        });
    }
  }, [projectId, canvas, user, navigate]);

  const addObject = (obj) => {
    if (!canvas) return;
    canvas.add(obj);
    canvas.centerObject(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    setActiveObject(obj); // Ensure panel appears immediately
    saveState();
  };

  const addText = () => addObject(new IText('Your Text', { fill: '#fff', fontSize: 48, fontFamily: 'Arial' }));
  const addCircle = () => addObject(new Circle({ radius: 50, fill: '#4f46e5' }));
  const addRectangle = () => addObject(new Rect({ width: 100, height: 100, fill: '#10b981' }));
  const addTriangle = () => addObject(new Triangle({ width: 100, height: 100, fill: '#f59e0b' }));

  const handleColorChange = (color, prop = 'fill') => {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.set(prop, color.hex);
    canvas.renderAll();
    setActiveObject(obj); // Update panel
  };

  const handlePropertyChange = (prop, value) => {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.set(prop, value);
    canvas.renderAll();
    setActiveObject(obj); // Update panel
  };

  const deleteActiveObject = () => {
    if (canvas && canvas.getActiveObject()) {
      canvas.remove(canvas.getActiveObject());
      setActiveObject(null);
      saveState();
    }
  };

  const bringForward = () => {
    if (canvas && canvas.getActiveObject()) {
      canvas.bringForward(canvas.getActiveObject());
      saveState();
    }
  };

  const sendBackwards = () => {
    if (canvas && canvas.getActiveObject()) {
      canvas.sendBackwards(canvas.getActiveObject());
      saveState();
    }
  };

  const handleSave = async () => {
    if (!canvas || !user?.token) return;
    const designState = history[historyIndex];
    const projectData = { name: projectName, designState };

    try {
      if (projectId === 'new') {
        const newProject = await projectService.createProject(projectData, user.token);
        navigate(`/editor/${newProject._id}`, { replace: true });
        alert('Project created successfully!');
      } else {
        await projectService.updateProject(projectId, projectData, user.token);
        alert('Project saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Error saving project. See console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="w-full bg-gray-800 p-2 flex justify-between items-center shadow-md z-10">
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-transparent text-lg font-semibold border-b-2 border-transparent focus:border-indigo-500 focus:outline-none p-1"
        />
        <div className="flex items-center gap-2">
            <button onClick={undo} disabled={historyIndex <= 0} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"><FaUndo /></button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"><FaRedo /></button>
        </div>
        <div>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm mr-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">Dashboard</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors">Save Project</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <motion.aside initial={{ x: -100 }} animate={{ x: 0 }} className="w-56 bg-gray-800 p-4 space-y-2 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Add Elements</h3>
          <ToolbarButton onClick={addText} title="Add Text"><FaFont className="mr-3" /> Text</ToolbarButton>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-4">Shapes</h3>
          <ToolbarButton onClick={addCircle} title="Add Circle"><FaCircle className="mr-3" /> Circle</ToolbarButton>
          <ToolbarButton onClick={addRectangle} title="Add Rectangle"><FaVectorSquare className="mr-3" /> Rectangle</ToolbarButton>
          <ToolbarButton onClick={addTriangle} title="Add Triangle"><FaShapes className="mr-3" /> Triangle</ToolbarButton>
        </motion.aside>

        <main className="flex-1 flex items-center justify-center p-4 bg-gray-900">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="shadow-2xl bg-gray-700 rounded-lg">
            <canvas ref={canvasRef} />
          </motion.div>
        </main>

        <motion.aside
          initial={{ x: 300 }}
          animate={{ x: activeObject ? 0 : 300 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="w-72 bg-gray-800 p-4 space-y-6 overflow-y-auto"
        >
          {activeObject ? (
            <>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Properties</h3>
              <PropertyControl label="Fill Color">
                  <SketchPicker
                      color={activeObject.get('fill')}
                      onChangeComplete={(color) => handleColorChange(color, 'fill')}
                      disableAlpha={true}
                      styles={{ default: { picker: { background: '#374151', boxShadow: 'none' } } }}
                  />
              </PropertyControl>
             
<PropertyControl label="Stroke Width">
  <input
    type="range"
    min="0"
    max="30"
    value={typeof activeObject.get('strokeWidth') === 'number' ? activeObject.get('strokeWidth') : 0}
    onChange={e => handlePropertyChange('strokeWidth', parseInt(e.target.value, 10))}
    className="w-full"
  />
</PropertyControl>
<PropertyControl label="Opacity">
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={typeof activeObject.get('opacity') === 'number' ? activeObject.get('opacity') : 1}
    onChange={e => handlePropertyChange('opacity', parseFloat(e.target.value))}
    className="w-full"
  />
</PropertyControl>
              {activeObject.type === 'i-text' && (
                <>
                  <PropertyControl label="Font Family">
                      <select value={activeObject.get('fontFamily')} onChange={(e) => handlePropertyChange('fontFamily', e.target.value)} className="w-full p-2 bg-gray-700 rounded text-sm focus:outline-none">
                          {googleFonts.map(font => <option key={font} value={font}>{font}</option>)}
                      </select>
                  </PropertyControl>
                  <PropertyControl label="Font Size">
                      <input type="number" value={activeObject.get('fontSize')} onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value, 10))} className="w-full p-2 bg-gray-700 rounded text-sm focus:outline-none" />
                  </PropertyControl>
                </>
              )}

              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-4">Layers</h3>
              <ToolbarButton onClick={bringForward}><FaArrowUp className="mr-3" /> Bring Forward</ToolbarButton>
              <ToolbarButton onClick={sendBackwards}><FaArrowDown className="mr-3" /> Send Backwards</ToolbarButton>

              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-4">Actions</h3>
              <ToolbarButton onClick={deleteActiveObject}>
                <FaTrash className="mr-3 text-red-400" /> <span className="text-red-400">Delete Object</span>
              </ToolbarButton>
            </>
          ) : (
            <div className="text-center text-gray-500 pt-10">
              <FaMousePointer className="mx-auto text-4xl mb-4" />
              <p className="text-sm">Select an object on the canvas to see its properties.</p>
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  );
};

export default EditorPage;