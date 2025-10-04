// import React, { useState, useRef, useEffect } from 'react';
// // Corrected import: We import the specific classes we need from Fabric.js
// import { Canvas, Circle, Rect, IText } from 'fabric';
// import { motion } from 'framer-motion';

// const EditorPage = () => {
//   const canvasRef = useRef(null);
//   const [canvas, setCanvas] = useState(null);

//   useEffect(() => {
//     // We now use `new Canvas()` directly
//     const initCanvas = new Canvas(canvasRef.current, {
//       height: 600,
//       width: 800,
//       backgroundColor: '#1f2937',
//     });
//     setCanvas(initCanvas);

//     return () => {
//       initCanvas.dispose();
//     };
//   }, []);

//   const addCircle = () => {
//     if (!canvas) return;
//     // Use `new Circle()` directly
//     const circle = new Circle({
//       radius: 50,
//       fill: 'red',
//       left: 100,
//       top: 100,
//     });
//     canvas.add(circle);
//     canvas.renderAll();
//   };

//   const addRectangle = () => {
//     if (!canvas) return;
//     // Use `new Rect()` directly
//     const rect = new Rect({
//       width: 100,
//       height: 100,
//       fill: 'blue',
//       left: 200,
//       top: 200,
//     });
//     canvas.add(rect);
//     canvas.renderAll();
//   };

//   const addText = () => {
//     if (!canvas) return;
//     // Use `new IText()` directly
//     const text = new IText('Your Logo', {
//       left: 150,
//       top: 150,
//       fill: 'white',
//       fontSize: 40,
//       fontFamily: 'Arial'
//     });
//     canvas.add(text);
//     canvas.renderAll();
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
//       <motion.aside 
//         initial={{ x: -100 }}
//         animate={{ x: 0 }}
//         className="w-full md:w-64 bg-gray-800 p-4 space-y-4"
//       >
//         <h2 className="text-xl font-bold">Tools</h2>
//         <button onClick={addCircle} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md">Add Circle</button>
//         <button onClick={addRectangle} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md">Add Rectangle</button>
//         <button onClick={addText} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md">Add Text</button>
//       </motion.aside>

//       <main className="flex-1 flex items-center justify-center p-4">
//         <motion.div 
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="shadow-2xl"
//         >
//           <canvas ref={canvasRef} />
//         </motion.div>
//       </main>
//     </div>
//   );
// };

// export default EditorPage;

import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import projectService from '../../api/projectService';

// --- Helper Components for a Cleaner UI ---

const ToolbarButton = ({ onClick, children, title }) => (
  <button 
    onClick={onClick} 
    title={title} 
    className="w-full p-2 text-left text-sm text-gray-200 hover:bg-indigo-700 rounded-md transition-colors"
  >
    {children}
  </button>
);

const PropertyControl = ({ label, children }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-xs text-gray-400">{label}</label>
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

  // Function to update the state based on the currently selected object
  const updatePropertiesPanel = (obj) => {
    if (obj) {
      setActiveObject({
        fill: obj.get('fill'),
        stroke: obj.get('stroke'),
        strokeWidth: obj.get('strokeWidth'),
        opacity: obj.get('opacity'),
        fontFamily: obj.get('fontFamily') || 'Arial',
        type: obj.type
      });
    } else {
      setActiveObject(null);
    }
  };

  // Initialize canvas and set up event listeners when the component mounts
  useEffect(() => {
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      height: 600,
      width: 800,
      backgroundColor: '#1f2937',
    });
    setCanvas(initCanvas);

    // Event listeners to show/hide the properties panel
    initCanvas.on('selection:created', (e) => updatePropertiesPanel(e.target));
    initCanvas.on('selection:updated', (e) => updatePropertiesPanel(e.target));
    initCanvas.on('selection:cleared', () => updatePropertiesPanel(null));
    initCanvas.on('object:modified', (e) => updatePropertiesPanel(e.target));

    // Clean up canvas instance on unmount
    return () => initCanvas.dispose();
  }, []);

  // Load existing project data if an ID is present in the URL
  useEffect(() => {
    if (projectId && projectId !== 'new' && canvas && user?.token) {
      projectService.getProject(projectId, user.token)
        .then(data => {
          if (data) {
            setProjectName(data.name);
            canvas.loadFromJSON(data.designState, canvas.renderAll.bind(canvas));
          }
        })
        .catch(err => {
          console.error("Failed to load project", err);
          navigate('/dashboard'); // Redirect if project not found or error
        });
    }
  }, [projectId, canvas, user?.token, navigate]);
  
  // --- Functions to Add Objects to the Canvas ---
  const addObject = (obj) => {
    if (!canvas) return;
    canvas.add(obj);
    canvas.centerObject(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };
  
  const addText = () => addObject(new fabric.IText('Your Text', { fill: '#fff', fontSize: 48, fontFamily: 'Arial' }));
  const addCircle = () => addObject(new fabric.Circle({ radius: 50, fill: '#4f46e5' }));
  const addRectangle = () => addObject(new fabric.Rect({ width: 100, height: 100, fill: '#10b981' }));
  const addTriangle = () => addObject(new fabric.Triangle({ width: 100, height: 100, fill: '#f59e0b' }));

  // --- Functions to Modify Selected Objects ---
  const handlePropertyChange = (prop, value) => {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.set(prop, value);
    canvas.renderAll();
    updatePropertiesPanel(obj); // Keep the panel in sync
  };
  
  const deleteActiveObject = () => {
    if (canvas && canvas.getActiveObject()) {
      canvas.remove(canvas.getActiveObject());
    }
  };

  const bringForward = () => {
    if (canvas && canvas.getActiveObject()) {
      canvas.bringForward(canvas.getActiveObject());
    }
  };

  const sendBackwards = () => {
    if (canvas && canvas.getActiveObject()) {
      canvas.sendBackwards(canvas.getActiveObject());
    }
  };

  // --- Save Functionality ---
  const handleSave = async () => {
    if (!canvas || !user?.token) return;
    
    const designState = canvas.toJSON();
    const projectData = { name: projectName, designState };

    try {
      if (projectId === 'new') {
        const newProject = await projectService.createProject(projectData, user.token);
        // After creating, navigate to the new editor URL so future saves are updates
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
      {/* Header Bar */}
      <header className="w-full bg-gray-800 p-2 flex justify-between items-center shadow-md z-10">
        <input 
          type="text" 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-transparent text-lg font-semibold border-b-2 border-transparent focus:border-indigo-500 focus:outline-none p-1"
        />
        <div>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm mr-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">Dashboard</button>
          <button onClick={handleSave} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors">Save Project</button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Toolbar */}
        <motion.aside initial={{ x: -100 }} animate={{ x: 0 }} className="w-56 bg-gray-800 p-4 space-y-2 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Add Elements</h3>
          <ToolbarButton onClick={addText} title="Add Text">Text</ToolbarButton>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-4">Shapes</h3>
          <ToolbarButton onClick={addCircle} title="Add Circle">Circle</ToolbarButton>
          <ToolbarButton onClick={addRectangle} title="Add Rectangle">Rectangle</ToolbarButton>
          <ToolbarButton onClick={addTriangle} title="Add Triangle">Triangle</ToolbarButton>
        </motion.aside>

        {/* Main Canvas Area */}
        <main className="flex-1 flex items-center justify-center p-4 bg-gray-900">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="shadow-2xl bg-gray-700 rounded-lg">
            <canvas ref={canvasRef} />
          </motion.div>
        </main>

        {/* Right Properties Panel (Conditional Rendering) */}
        <motion.aside 
          initial={{ x: 300 }}
          animate={{ x: activeObject ? 0 : 300 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="w-64 bg-gray-800 p-4 space-y-4 overflow-y-auto"
        >
          {activeObject ? (
            <>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Properties</h3>
              <PropertyControl label="Fill Color">
                <input type="color" value={activeObject.fill} onChange={(e) => handlePropertyChange('fill', e.target.value)} className="w-full h-8 bg-gray-700 rounded cursor-pointer" />
              </PropertyControl>
              <PropertyControl label="Stroke Color">
                <input type="color" value={activeObject.stroke || '#ffffff'} onChange={(e) => handlePropertyChange('stroke', e.target.value)} className="w-full h-8 bg-gray-700 rounded cursor-pointer" />
              </PropertyControl>
              <PropertyControl label="Stroke Width">
                <input type="range" min="0" max="30" value={activeObject.strokeWidth || 0} onChange={(e) => handlePropertyChange('strokeWidth', parseInt(e.target.value, 10))} className="w-full" />
              </PropertyControl>
              <PropertyControl label="Opacity">
                <input type="range" min="0" max="1" step="0.01" value={activeObject.opacity} onChange={(e) => handlePropertyChange('opacity', parseFloat(e.target.value))} className="w-full" />
              </PropertyControl>

              {activeObject.type === 'i-text' && (
                  <PropertyControl label="Font Family">
                      <select value={activeObject.fontFamily} onChange={(e) => handlePropertyChange('fontFamily', e.target.value)} className="w-full p-2 bg-gray-700 rounded text-sm focus:outline-none">
                          <option>Arial</option>
                          <option>Verdana</option>
                          <option>Georgia</option>
                          <option>Times New Roman</option>
                          <option>Courier New</option>
                          <option>Impact</option>
                      </select>
                  </PropertyControl>
              )}

              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-4">Layers</h3>
              <ToolbarButton onClick={bringForward}>Bring Forward</ToolbarButton>
              <ToolbarButton onClick={sendBackwards}>Send Backwards</ToolbarButton>

              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-4">Actions</h3>
              <ToolbarButton onClick={deleteActiveObject}>
                <span className="text-red-400">Delete Object</span>
              </ToolbarButton>
            </>
          ) : (
            <div className="text-center text-gray-500 pt-10">
              <p className="text-sm">Select an object on the canvas to see its properties.</p>
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  );
};

export default EditorPage;

