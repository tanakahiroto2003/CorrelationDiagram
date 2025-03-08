import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';

const CorrelationDiagram = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [nodes, setNodes] = useState([]);
  const [relations, setRelations] = useState([]);
  const [relationLines, setRelationLines] = useState([]);
  const navigate = useNavigate();

  const listid = sessionStorage.getItem('selectedListId');

  useEffect(() => {
    if (!listid) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/correlation/${listid}`);
        const data = await response.json();

        setNodes(data.nodes);
        setRelations(data.relations);
        setRelationLines(data.relationLines);
      } catch (error) {
        console.error('データの取得に失敗しました', error);
      }
    };

    fetchData();
  }, [listid]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const svg = d3.select("#diagram")
      .selectAll("svg")
      .data([null])
      .join("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // データ形式に変換
    const d3Nodes = nodes.map(Node => ({
      id: Node.NodeID,
      name: Node.Node_Name,
      description: Node.Node_Description,
      color: Node.Node_Color,
      image: Node.Node_ImagePath ? `${process.env.REACT_APP_BASE_URL}${Node.Node_ImagePath}` : null,
    }));

    const d3Links = relations.map(rel => ({
      source: rel.NodeID,
      target: rel.TargetNodeID,
      direction: rel.NodeRelation_Direction,
      NodeRelationID: rel.NodeRelationID
    }));

    const simulation = d3.forceSimulation(d3Nodes)
      .force("link", d3.forceLink(d3Links).id(d => d.id).distance(150)) //ノード間の距離
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // 始点用の矢印マーカー
    svg.append("defs").selectAll("marker")
      .data(["arrow-start"])
      .enter().append("marker")
      .attr("id", "arrow-start")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", -25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M10,-5L0,0L10,5")
      .attr("fill", "#000");

    // 終点用の矢印マーカー
    svg.append("defs").selectAll("marker")
      .data(["arrow-end"])
      .enter().append("marker")
      .attr("id", "arrow-end")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 35)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#000");

    // リンク（関係線）の描画
    const link = svg.append("g")
      .selectAll(".link")
      .data(d3Links)
      .enter().append("line")
      .attr("class", "link")
      .attr("stroke", d => {
        const relationLine = relationLines.find(line => line.NodeRelationID === d.NodeRelationID);
        return relationLine ? relationLine.NodeRelationLine_Color : '#000000';
      })
      .attr("stroke-width", 2)
      .attr("marker-end", d => {
        // one-wayとtwo-wayの場合に終点に矢印を表示
        if (d.direction === "one-way" || d.direction === "two-way") {
          return "url(#arrow-end)";
        }
        return "";
      })
      .attr("marker-start", d => {
        // two-way の場合のみ始点に矢印を表示
        if (d.direction === "two-way") {
          return "url(#arrow-start)";
        }
        return "";
      });

    // ノード（画像または色付き円）の描画
    const node = svg.append("g")
      .selectAll(".node")
      .data(d3Nodes)
      .enter().append("g")
      .call(d3.drag()
        .on("start", dragstart)
        .on("drag", dragged)
        .on("end", dragend));

    // 画像ノード描画（画像がある場合）
    const imageNodes = node.filter(d => d.image)
      .append("image")
      .attr("xlink:href", d => d.image)
      .attr("width", 50)
      .attr("height", 50)
      .attr("x", d => d.x - 25)
      .attr("y", d => d.y - 25);

    // ノード描画（画像がない場合）
    const circleNodes = node.filter(d => !d.image)
      .append("circle")
      .attr("r", 25)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("fill", d => d.color);

    // ノード名表示
    const nodeName = svg.append("g")
      .selectAll(".node-name")
      .data(d3Nodes)
      .enter().append("text")
      .attr("class", "node-name")
      .attr("x", d => d.x)
      .attr("y", d => d.y - 35)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .text(d => d.name);

    // 関係線説明を表示
    const relationLineDescriptions = svg.append("g")
      .selectAll(".relation-line-description")
      .data(d3Links)
      .enter().append("text")
      .attr("class", "relation-line-description")
      .attr("x", d => (d.source.x + d.target.x) / 2)
      .attr("y", d => (d.source.y + d.target.y) / 2 - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", 12)
      .attr("fill", d => {
        const relationLine = relationLines.find(line => line.NodeRelationID === d.NodeRelationID);
        return relationLine ? relationLine.NodeRelationLine_Color : '#000000';
      })
      .text(d => {
        const relationLine = relationLines.find(line => line.NodeRelationID === d.NodeRelationID);
        return relationLine ? relationLine.NodeRelationLine_Description : '';
      });

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("pointer-events", "none");

    node.on("mouseover", function (event, d) {
      tooltip.style("visibility", "visible").text(d.description);
    })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });

    link.on("mouseover", function (event, d) {
      tooltip.style("visibility", "visible").text(d.NodeRelationLine_Description);
    })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });

    simulation.force("boundary", d3.forceCollide().radius(30)) // ノード間の衝突を防止
      .on("tick", () => {
        d3Nodes.forEach(d => {
          const paddingX = width * 0.05;
          const paddingYTop = height * 0.03;
          const paddingYBottom = height * 0.2;

          d.x = Math.max(paddingX, Math.min(width - paddingX, d.x));
          d.y = Math.max(paddingYTop, Math.min(height - paddingYBottom, d.y));
        });

        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        imageNodes
          .attr("x", d => d.x - 25)
          .attr("y", d => d.y - 25);

        circleNodes
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        nodeName
          .attr("x", d => d.x)
          .attr("y", d => d.y - 35);

        relationLineDescriptions
          .attr("x", d => (d.source.x + d.target.x) / 2)
          .attr("y", d => (d.source.y + d.target.y) / 2 - 10);
      });

    function dragstart(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragend(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [width, height, nodes, relations, relationLines]);

  return (
    <div id="diagram" style={{ height: '100vh', width: '100%' }}></div>
  );
};

export default CorrelationDiagram;
