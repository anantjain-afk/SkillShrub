import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// Determines border color based on XP (difficulty) and completion
const getBorderColor = (xp, completed) => {
    if (completed) return '#ffd700'; // Gold for completed
    if (xp >= 150) return '#ff00ff'; // Boss/Hard -> Pink
    if (xp >= 100) return '#00ffff'; // Medium -> Cyan
    return '#00ff00'; // Easy -> Green
};

const PixelNode = ({ data }) => {
    const borderColor = getBorderColor(data.xpReward || 100, data.completed);

    const style = {
        background: '#000',
        color: '#fff',
        border: `4px solid ${borderColor}`,
        padding: '10px',
        fontFamily: '"Press Start 2P", system-ui',
        fontSize: '10px',
        textAlign: 'center',
        width: '160px',
        boxShadow: `4px 4px 0px 0px ${borderColor}`,
        imageRendering: 'pixelated',
        position: 'relative'
    };

    const xpStyle = {
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        background: borderColor,
        color: '#000',
        padding: '2px 4px',
        fontSize: '8px',
        fontWeight: 'bold'
    };

  return (
    <div style={style}>
        {/* Connection Handles */}
        <Handle type="target" position={Position.Top} style={{ background: borderColor, width: '8px', height: '8px', borderRadius: 0 }} />
      
        <div style={xpStyle}>XP: {data.xpReward}</div>
        <div style={{ marginBottom: '5px', color: borderColor, textTransform: 'uppercase' }}>
            {data.label}
        </div>
        
        <Handle type="source" position={Position.Bottom} style={{ background: borderColor, width: '8px', height: '8px', borderRadius: 0 }} />
    </div>
  );
};

export default memo(PixelNode);
