       
(() => {
  


  ////////////////////////////////////////////////////////////////////////////////
  // Dragging

  const dragTarget = document.getElementById('dragTarget');
  const uploadFiles = document.getElementById('uploadFiles');
  const loadExample = document.getElementById('loadExample');
+  const useTreemap = document.getElementById('useTreemap'); // Get the treemap button
   let dragging = 0;
   let filesInput;

@@ -293,6 +294,8 @@
   const progressBar = document.querySelector('#progressBar .progress');
   const originalStatus = document.getElementById('originalStatus');
   const generatedStatus = document.getElementById('generatedStatus');
+  const chartPanel = document.getElementById('chartPanel'); // Get chart panel
+  let currentVisualization = null; // Track current visualization

   function isProbablySourceMap(file) {
     return file.name.endsWith('.map') || file.name.endsWith('.json');
@@ -313,6 +316,7 @@
     toolbar.style.display = 'none';
     statusBar.style.display = 'none';
     canvas.style.display = 'none';
+    chartPanel.innerHTML = ''; // Clear chart panel
   }

   function showLoadingError(text) {
@@ -592,6 +596,18 @@
     const endTime = Date.now();
     console.log(`Finished loading in ${endTime - startTime}ms`);
   }
+
+  // Treemap visualization integration
+  useTreemap.onclick = () => {
+    if (sm) {
+      chartPanel.innerHTML = ''; // Clear existing chart
+      const treemapVis = createTreemap(sm); // Call createTreemap with source map data
+      chartPanel.appendChild(treemapVis); // Add treemap to chart panel
+      currentVisualization = 'treemap'; // Update visualization tracker
+    } else {
+      console.warn("Source map data not yet loaded.");
+    }
+  };
 
   ////////////////////////////////////////////////////////////////////////////////
   // Drawing
