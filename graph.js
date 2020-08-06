class Graph
{
  //Nodes is an array of strings
  //Edges is an array of objects of the form {from: "node", to: "node"}
  constructor(nodes, edges)
  {
    this.adjList = new Map();
    //Insert nodes
    for(var i of nodes)
      this.insertNode(i);
    //Insert edges
    for(var i of edges)
      this.insertEdge(i.from, i.to);
  }

  insertNode(vertex)
  {
    this.adjList.set(vertex, []);
  }

  insertEdge(from, to)
  {
    if(!this.adjList.has(from))
      this.insertNode(from);
    if(!this.adjList.has(to))
      this.insertNode(to);
    this.adjList.get(from).push(to);
  }

  getAdjacent(vertex)
  {
    return this.adjList.get(vertex);
  }

  print()
  {
    var keys = this.adjList.keys();
    //Loop through nodes
    for (var i of keys)
    {
        var adjNodes = this.adjList.get(i);

        var conc = "";
        for (var j of adjNodes)
            conc += j + " ";
        console.log(i + " -> " + conc);
    }
  }

  searchBreadthFirst(start, end)
  {
    var q = [];
    var visitedMap = new Map();
    var distanceMap = new Map();
    var predecessorMap = new Map();
    for(var node of this.adjList.keys()) //Loop through all nodes
    {
      visitedMap.set(node, false);
      distanceMap.set(node, Number.MAX_SAFE_INTEGER);
    }

    //Put the first node on the queue
    visitedMap.set(start, true);
    distanceMap.set(start, 0);
    q.push(start);
    while(!(q.length == 0))
    {
      var u = q.shift();
      var adjacentNode = "";
      var adjNodes = this.adjList.get(u);
      for (var i of adjNodes)
      {
        adjacentNode = i;
        if(visitedMap.get(adjacentNode) == false) //If node hasn't been visited
        {
          visitedMap.set(adjacentNode, true);
          distanceMap.set(adjacentNode, distanceMap.get(u) + 1);
          predecessorMap.set(adjacentNode, u);
          q.push(adjacentNode);
        }
        if(adjacentNode == end) //If found
        {
          var path = [];
          var crawl = end;
          path.push(end);
          while(predecessorMap.get(crawl) != undefined)
          {
            path.push(predecessorMap.get(crawl));
            crawl = predecessorMap.get(crawl);
          }
          return path;
        }
      }
    }
    return undefined;
    console.log("connection not found");
  }

  searchBellmanFord(start, end)
  {
    var distance = [];
    var predecessor = [];
    for(var i of this.adjList.keys()) //For each vertex
    {
      distance[i] = Infinity; //Intialize the distance from the source to infinity
      predecessor[i] = null; //Set all predecessors to null
    }
    distance[start] = 0 //Set the starting nodes distance from itself to 0

    //Relaxation
    var weight = 1; //Graph is unweighted so all weights are treated as 1
    var vSize = this.adjList.size;
    for(var i = 0; i < vSize; i++)
    {
      var changesMade = false;
      //For each edge from u to v
      for(var u of this.adjList.keys())
        for(var v of this.adjList.get(u))
        {
          if(distance[u] + weight < distance[v])
            {
              distance[v] = distance[u] + weight;
              predecessor[v] = u;
              if(!changesMade)
                changesMade = true;
            }
        }
      //If no changes were made in an interation of the main loop no more changes will need to be made  
      if(!changesMade)
        break;
    }

    //Return
    if(predecessor[end] == undefined)
      return undefined;
    var crawl = end;
    var path = [];
    while(crawl != start)
    {
      path.push(crawl);
      crawl = predecessor[crawl];
    }
    path.push(start);
    return path;
  }


  searchDijkstra(start, end)
  {
    var weight = 1;
    var q = [];
    var distance = [];
    var prev = [];
    for(var v of this.adjList.keys()) //For each vertex
    {
      distance[v] = Number.MAX_SAFE_INTEGER; //Intialize the distance from the source to infinity
      prev[v] = null; //Set all predecessors to null
      q.push(v);
    }

    distance[start] = 2;
    while(!(q.length == 0)) //While q is not empty
    {
      //Find v with min dist
      var currentMinElement = q[0];
      for(var v of q)
      {
        if(distance[v] < distance[currentMinElement])
          currentMinElement = v;
      }
      var u = currentMinElement;
      //Remove u from q
      q.splice(q.indexOf(u), 1);
      //For each neighbor v of u
      for(var v of this.adjList.get(u))
      {
        var alt = distance[u] + weight;
        if(alt < distance[v])
        {
          distance[v] = alt;
          prev[v] = u;
        }
        if(v == end)
        {
          var crawl = end;
          var path = [];
          while(crawl != start)
          {
            path.push(crawl);
            crawl = prev[crawl];
          }
          path.push(start);
          return path;
        }
      }
    }
    //Path not found
    return undefined;
  }
}
