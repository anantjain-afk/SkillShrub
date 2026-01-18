import React, { useEffect, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import PixelNode from './PixelNode';

const nodeWidth = 200; // Increased for pixel styling
const nodeHeight = 80;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // Shift the dagre node position (center) to the top-left (reactflow position)
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes: layoutedNodes, edges };
};

const RoadmapVisualizer = ({ roadmap, onNodeClick }) => {
    const { nodes: initialNodes, edges: initialEdges } = roadmap;

    const nodeTypes = useMemo(() => ({ pixel: PixelNode }), []);

    const rfNodes = initialNodes.map(node => ({
        id: node.id,
        type: 'pixel', // Use our custom node
        data: { label: node.title, xpReward: node.xpReward, completed: node.completed },
        position: { x: 0, y: 0 },
    }));

    const rfEdges = initialEdges.map(edge => ({
        id: `e${edge.sourceNodeId}-${edge.targetNodeId}`,
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
        type: 'step', // Retro step lines
        markerEnd: {
             type: MarkerType.ArrowClosed,
             color: '#00ffff'
        },
        style: { stroke: '#00ffff', strokeWidth: 2 }
    }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        rfNodes,
        rfEdges
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    useEffect(() => {
        const resetNodes = initialNodes.map(node => ({
            id: node.id,
            type: 'pixel',
            data: { label: node.title, xpReward: node.xpReward, completed: node.completed },
            position: { x: 0, y: 0 },
        }));
        
        const resetEdges = initialEdges.map(edge => ({
            id: `e${edge.sourceNodeId}-${edge.targetNodeId}`,
            source: edge.sourceNodeId,
            target: edge.targetNodeId,
            type: 'step',
            markerEnd: {
                 type: MarkerType.ArrowClosed,
                 color: '#00ffff'
            },
            style: { stroke: '#00ffff', strokeWidth: 2 },
            animated: false
        }));

        const { nodes: lNodes, edges: lEdges } = getLayoutedElements(resetNodes, resetEdges);
        setNodes(lNodes);
        setEdges(lEdges);
    }, [roadmap, setNodes, setEdges, initialNodes, initialEdges]);

  return (
    <div style={{ width: '100%', height: '600px', border: '4px solid #fff', boxShadow: '4px 4px 0px #000' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick && onNodeClick(node.id)}
        fitView
      >
        <Controls style={{ border: '2px solid #000', borderRadius: 0 }} />
        <Background color="#444" gap={20} size={1} />
      </ReactFlow>
    </div>
  );
};

export default RoadmapVisualizer;
