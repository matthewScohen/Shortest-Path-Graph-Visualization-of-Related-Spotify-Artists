//Create Graph
graph = new Graph(artists, edges);
//Add autocomplete to artist input boxes
var options = "";
for(var i = 0; i < artists.length; i++)
{
  options += '<option value="'+artists[i]+'" />';
}
document.getElementById("inputData1").innerHTML = options;
document.getElementById("inputData1").innerHTML = options;

/********************************/
/*** GRAPH VISUALIZATION CODE ***/
/***  vvvvvvvvvvvvvvvvvvvvvv  ***/
//Creates a node object that can be passed as the array to a vis.DataSet from an array of strings
function getNodeSetArrayFromArtists(artists)
{
  var nodeObjectArray = [];
  for(var i = 0; i < artists.length; i++)
  {
    nodeObjectArray.push({id: artists[i], label: artists[i]});
  }
  return nodeObjectArray;
}
//Creates a set of edges that point from each artists to the one after them in the array
function getEdgeSetArrayFromArtists(artists)
{
  var edgeObjectArray = [];
  for(var i = 0; i < artists.length-1; i++)
  {
    edgeObjectArray.push({id: artists[i] + "-" + artists[i+1], from: artists[i], to: artists[i+1]});
  }
  return edgeObjectArray;
}

//Create nodes and edges from artists array
var pathArtists = []
var nodes = new vis.DataSet(getNodeSetArrayFromArtists(pathArtists));
var edges = new vis.DataSet(getEdgeSetArrayFromArtists(pathArtists));

//Set network container and data
var container = document.getElementById("graph");
var data = {
  nodes: nodes,
  edges: edges
};
//Set network options
var options = {
physics: {
  stabilization: false
},
  interaction: {
  dragNodes: false,
  dragView: true,
  hideEdgesOnDrag: false,
  hideEdgesOnZoom: false,
  hideNodesOnDrag: false,
  hover: false,
  hoverConnectedEdges: false,
  keyboard: {
    enabled: false,
    speed: {x: 10, y: 10, zoom: 0.02},
    bindToWindow: true
  },
  multiselect: false,
  navigationButtons: false,
  selectable: true,
  selectConnectedEdges: false,
  tooltipDelay: 300,
  zoomView: true
},
layout: {
  randomSeed: undefined,
  improvedLayout:false,
  clusterThreshold: 150,
  hierarchical: {
    enabled:false,
    levelSeparation: 150,
    nodeSpacing: 500,
    treeSpacing: 200,
    blockShifting: true,
    edgeMinimization: true,
    parentCentralization: true,
    direction: 'RL',        // UD, DU, LR, RL
    sortMethod: 'hubsize',  // hubsize, directed
    shakeTowards: 'leaves'  // roots, leaves
  }
},
edges:{
    arrows: {
      from: {
        enabled: true,
        type: "arrow",
        scaleFactor: 0.2
      }
    }
  }
};
//Create network
var network = new vis.Network(container, data, options);

/********************************/
/*** HTML FUNCTION CODE ***/
/***  vvvvvvvvvvvvvvvvvvvvvv  ***/

//Search button
document.getElementById("Search").onclick = function()
{
  //Find shortest Path
  var artist1 = document.getElementById("input1").value;
  var artist2 = document.getElementById("input2").value;
  var runtime = 0;
  if(document.getElementById("Alg1").checked == true)
  {
    var time0 = performance.now();
    pathArtists = graph.searchBreadthFirst(artist1, artist2);
    var time1 = performance.now();
    runtime = time1-time0;
    document.getElementById("pathText").textContent = "Time to find shortest path:";
    document.getElementById("runtime").textContent = (runtime/1000).toFixed(4);
  }
  else if(document.getElementById("Alg2").checked == true)
  {
    var time0 = performance.now();
    pathArtists = graph.searchBellmanFord(artist1, artist2);
    var time1 = performance.now();
    runtime = time1-time0;
    document.getElementById("pathText").textContent = "Time to find shortest path:";
    document.getElementById("runtime").textContent = (runtime/1000).toFixed(4);
  }
  else if(document.getElementById("Alg3").checked == true)
  {
    var time0 = performance.now();
    pathArtists = graph.searchDijkstra(artist1, artist2);
    var time1 = performance.now();
    runtime = time1-time0;
    document.getElementById("pathText").textContent = "Time to find shortest path:";
    document.getElementById("runtime").textContent = (runtime/1000).toFixed(4);
  }
  //If a path was found
  if(pathArtists != undefined)
  {
    //Create path
    var nodes = getNodeSetArrayFromArtists(pathArtists);
    var edges = getEdgeSetArrayFromArtists(pathArtists);
    //Used for highlighting
    var nodePath = getNodeSetArrayFromArtists(pathArtists);
    var edgePath = getEdgeSetArrayFromArtists(pathArtists);
    //Create network
    nodeDataSet = new vis.DataSet(nodes);
    edgeDataSet = new vis.DataSet(edges);
    data = {
      nodes: nodeDataSet,
      edges: edgeDataSet
    };
    network = new vis.Network(container, data, options);
    //Highlight path
    for(var i in nodePath)
    {
      var node = nodeDataSet.get(nodePath[i].id);
      node.color =
      {
        border: '#000000',
        background: '#E27D60',
        highlight:
        {
          border: '#000000',
          background: '#E27D60'
        }
      }
      nodeDataSet.update(node);
    }
  }
  //If no path was found...
  else
  {
    console.log("Path not found");
    document.getElementById("runtime").textContent = (runtime/1000).toFixed(4);
    //Clear the  network
    data = {
      nodes: new vis.DataSet([]),
      edges: new vis.DataSet([])
    };
    network = new vis.Network(container, data, options);
  }
  //Set onclick to reveal nodes related to the clicked node
  network.on("click", function (params)
  {
    console.log(params);
    var clickedNode = params.nodes[0];
    //Add nodes adjacent to those in the path to the network
    var adjacentNodes = graph.getAdjacent(clickedNode);
    console.log(params.nodes[0]);
    //Add adj nodes to network
    for(var j in adjacentNodes)
    {
      //If the node does not already exist
      if(!nodes.some(e => e.id === adjacentNodes[j]))
      {
        nodes.push({id: adjacentNodes[j], label: adjacentNodes[j]});
        nodeDataSet.update({id: adjacentNodes[j], label: adjacentNodes[j]});
      }
      //If the edge does not already exist
      if(!edges.some(e => e.id === adjacentNodes[j] + "-" + nodePath[i].id))
      {
        edges.push({id: adjacentNodes[j] + "-" + clickedNode, from: adjacentNodes[j], to: clickedNode});
        edgeDataSet.update({id: adjacentNodes[j] + "-" + clickedNode, from: adjacentNodes[j], to: clickedNode});
      }
    }
  });
};
