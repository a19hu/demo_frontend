import { ForceGraph3D } from 'react-force-graph';
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import axios from 'axios';
import defaultimage from '../image/download.jpeg'
import logo from '../image/logo.png'

const ImageTree = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://family-tree-yiq8.onrender.com/api/alltree/`);
        setData(response.data)
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);

  const nodes = [{
    id: 'All',
    user: 'IITJ',
    description: 'IITJ',
    img:logo
  }];
const links = [];
// console.log('data',data[1])

const processNode = (node, parentId) => {
   const nodeData = {
     id: node.rollNo,
    user: node.name,
     description: node.rollNo,
     img: node.picture ? defaultimage : defaultimage
  };
  nodes.push(nodeData);
    if (node.parentId) {
    links.push({ source: node.parentId, target: node.rollNo });
  }
  else{
      links.push({ source: 'All', target: node.rollNo });

  }
    node.children.forEach(child => {
    processNode(child);
  });
}
data.forEach(element => {
  const id= element.parentId ? element.parentId : 'All'
  if(element.parentId){
    const nodeData = {
      id: element.rollNo,
      user: element.name,
      description: element.rollNo,
      img: element.picture ? element.picture : defaultimage
    };
    nodes.push(nodeData);
    links.push({ source: 'All', target: element.rollNo });
  }
  else{

    processNode(element)
  }
});
const graphdata=
  {
    nodes: nodes,
    links: links
  }
// console.log(graphdata)
  return (
    <div >
        <ForceGraph3D
        backgroundColor={'#1b2735'}
        nodeColor={() => 'red'} 
        linkColor={'#1b2735'}
        width={window.innerWidth}
        height={window.innerHeight}
        linkCurvature={1}
        linkCurveRotation={2}
        linkWidth={0.5}
       graphData={graphdata}
       nodeLabel={node => `${node.user}: ${node.description}`}
       nodeAutoColorBy="user"
       linkDirectionalParticles={1}
       nodeThreeObject={({ img }) => {
         const imgTexture = new THREE.TextureLoader().load(img);
         imgTexture.colorSpace = THREE.SRGBColorSpace;
         const material = new THREE.SpriteMaterial({ 
           
           map: imgTexture ,
           color: 0xffffff,
       });
         const sprite = new THREE.Sprite(material);
         sprite.scale.set(12, 12);

         return sprite;
       }}
     />
      </div>

  );
};

export default ImageTree;
