
import { hover } from '@testing-library/user-event/dist/hover';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';

import { useSelector } from 'react-redux';

let data = {
  "products": ['Electronics', 'Book', 'Clothing'],
  "Electronics": ["Mobile", "Audio", "TV"],
  "Mobile": ["Mobile Phone", "Mobile Accessories"],
  "Audio": ["Mp3 Player", "Earphones"],
  "TV": ["Samsung Tv", "LG TV"]

}

const traversed = traverseFromHere();
const grouped = groupByParent(traversed).groupedData;

const mod_data = grouped;

function traverseFromHere(dataset = data, initial = "products", depth = 0) {
  let queue = [];
  let start = initial;
  let list = [];
  let uniqueCategory = new Set();
  queue.push({ category: start, depth, index: 0, parent: "null" })
  while (queue.length > 0) {

    const current = queue.shift();
    const children = dataset[current.category];

    // console.log(children)
    list.push(current);
    if (children) {
      uniqueCategory.add(current.category);
      let index = 0;
      for (let child of children) {
        queue.push({ category: child, depth: current.depth + 1, index, parent: current.category });
        index++;
      }
    }



  }
  //console.log(list.slice(1,))
  return { categories: list.slice(1,), uniqueCategories: [...uniqueCategory] }

}

function findSubcatOfParent(parent, dataset) {
  const foundCats = [];
  for (let i = 0; i < dataset.length; i++) {
    if (parent === dataset[i].parent) {
      foundCats.push(dataset[i])
      //console.log("dataset", dataset[i])

    }
    
  }

  return { parent, foundCats };
}

function groupByParent(structuredData) {
  const groupedData = []
  const cats = structuredData["categories"];
  const uniqueCats = [...structuredData["uniqueCategories"]];

  for (let i = 0; i < uniqueCats.length; i++) {
    groupedData[i] = findSubcatOfParent(uniqueCats[i], cats);
  }
  // console.log(structuredData);
  return { groupedData, structuredData }

}







function SideMenu(props) {

  let data = { parent: "", foundCats: [] }
  for (let i = 0; i < props.mod_data.length; i++) {
    const current = props.mod_data[i];
    if (current.parent === props.initial) {
     
      data = current;
      break;
    }
    else{
      data.parent = props.initial
    }
  }
  console.log("DAta", data)
  const parent = data.parent;
  const children = data.foundCats;
  let isRoot = false;
  if (props.initial == "products")
    isRoot = true;
  if (children.length == 0)
    return  <div className='parent'> {parent} </div> 

  return (
    <div className="dropdown">
     {!isRoot ? <div className='parent'> {parent} </div> : <></> }
      <div className="dropdown-content" style={isRoot ? {display: "block"}: {}}>
          {
            children.map((child, index) => {

              return <SideMenu key={`${index}_${child.category}`} initial={child.category} mod_data={mod_data} />
            })
          }

        </div> 
      

    </div>
  )
}




function App() {
  const [categories, setCategories] = useState();
  //const traversedData = traverseFromHere();
  //const groupedData = groupByParent(traversedData).groupedData;
  //console.log(categories)
  const [components, setComponents] = useState(grouped);
  const dispatch = useDispatch();
  const hoverItems = useSelector(state => state)

  function getCategoryComponents() {

  }


  return (
    <div className="categories_container"
      onMouseLeave={() => {



        dispatch({ type: "hover/set", payload: ["products"] })
      }
      }
    >


      <SideMenu key="products" initial="products" mod_data={mod_data} />



    </div>
  )
}

export default App;