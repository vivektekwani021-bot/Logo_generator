import React, { useState, useRef, useEffect } from 'react';
// Corrected import: We import the specific classes we need from Fabric.js
import { Canvas, Circle, Rect, IText } from 'fabric';
import { motion } from 'framer-motion';

const EditorPage = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    // We now use `new Canvas()` directly
    const initCanvas = new Canvas(canvasRef.current, {
      height: 600,
      width: 800,
      backgroundColor: '#1f2937',
    });
    setCanvas(initCanvas);

    return () => {
      initCanvas.dispose();
    };
  }, []);

  const addCircle = () => {
    if (!canvas) return;
    // Use `new Circle()` directly
    const circle = new Circle({
      radius: 50,
      fill: 'red',
      left: 100,
      top: 100,
    });
    canvas.add(circle);
    canvas.renderAll();
  };

  const addRectangle = () => {
    if (!canvas) return;
    // Use `new Rect()` directly
    const rect = new Rect({
      width: 100,
      height: 100,
      fill: 'blue',
      left: 200,
      top: 200,
    });
    canvas.add(rect);
    canvas.renderAll();
  };

  const addText = () => {
    if (!canvas) return;
    // Use `new IText()` directly
    const text = new IText('Your Logo', {
      left: 150,
      top: 150,
      fill: 'white',
      fontSize: 40,
      fontFamily: 'Arial'
    });
    canvas.add(text);
    canvas.renderAll();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      <motion.aside 
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="w-full md:w-64 bg-gray-800 p-4 space-y-4"
      >
        <h2 className="text-xl font-bold">Tools</h2>
        <button onClick={addCircle} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md">Add Circle</button>
        <button onClick={addRectangle} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md">Add Rectangle</button>
        <button onClick={addText} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md">Add Text</button>
      </motion.aside>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="shadow-2xl"
        >
          <canvas ref={canvasRef} />
        </motion.div>
      </main>
    </div>
  );
};

export default EditorPage;

