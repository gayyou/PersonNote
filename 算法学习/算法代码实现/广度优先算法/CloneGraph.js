/**
 * // Definition for a Node.
 * function Node(val,neighbors) {
 *    this.val = val;
 *    this.neighbors = neighbors;
 * };
 */
/**
 * @param {Node} node
 * @return {Node}
 */
var cloneGraph = function (node) {
  let map = {},
      queue = [node],
      temp;

  while(queue.length) {
    temp = queue.shift();
    map[temp.$id] = createNode(temp.$id, temp.val)
    let len = temp.neighbors.length;

    while(len--) {
      if (temp.neighbors[len].$id) {
        // 先将这个节点推进队列，等待下次进行创建节点
        queue.push(temp.neighbors[len])
      } else {
        // 这里是关联上一级，不需要关联到具体的node对象，只需要指明是哪个节点的id就可以了
        map[temp.$id].neighbors.push({$ref: temp.neighbors[len].$ref})
      }
    }
  }

  queue = [node]
  while(queue.length) {
    temp = queue.shift()
    let len = temp.neighbors.length;

    while(len--) {
      let id = temp.neighbors[len].$id;
      if (id) {
        map[temp.$id].neighbors.push(map[id]);
        queue.push(temp.neighbors[len])
      }
    }
  }

  return map[node.$id]
};

function createNode(id, val) {
  return {
    $id: id,
    val,
    neighbors: []
  }
}

console.log(JSON.stringify(cloneGraph(
  {
    "$id": "1",
    "neighbors": [
      {
        "$id": "2",
        "neighbors": [
          { 
            "$ref": "1" 
          },
          {
            "$id": "3",
            "neighbors": [
              { 
                "$ref": "2" 
              },
              {
                "$id": "4",
                "neighbors": [
                  { 
                    "$ref": "3" 
                  },
                  { 
                    "$ref": "1" 
                  }
                ],
                "val": 4
              }
            ],
            "val": 3
          }
        ],
        "val": 2
      },
      {
        "$ref": "4"
      }
    ],
    "val": 1
  })))