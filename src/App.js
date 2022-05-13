
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

    }
  }

  return {parent,foundCats};
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
  //console.log("Props", props)
  //console.log("Keys",Object.keys(props.content)[0])
  const ref = useRef(null)
  const ref2 = useRef(null)
  const parent = Object.values(props.content)[0];
  const children = Object.values(props.content)[1];
  const dispatch = useDispatch();
  const hoverItems = useSelector(state => state)
  //const children= [{category: "xyx", depth: 2, index: 0, listOrder: 44 }]
  let todelete = "";
  const [finalclass, setfinalclass] = useState();



 
  return (
      <div className={hoverItems.includes(parent)? 'sub_category_visible' : 'sub_category_hidden'} ref={ref} 
      onMouseEnter={(event) => {
            //console.log("Mouse Enter Event", event);
            if (hoverItems.includes(parent)){

            }
      }}

      onMouseLeave={ (event) => {
        const boundRectOfContainer = ref.current.getBoundingClientRect();
        


        const xc = boundRectOfContainer.width + boundRectOfContainer.left;

        const yc = boundRectOfContainer.height + boundRectOfContainer.top;
        
        //console.log("xc yc",xc, yc, "screenx screeny", event.screenX, event.screenY)
        if (event.screenX < xc ){
          //console.log("category",category)

          
          const index = hoverItems.indexOf(parent);
          todelete = parent;
          const temp = hoverItems.slice(0, index);
          console.log("temp",temp);
          //temp.push(category)
          
          dispatch({type: 'hover/set', payload:[...temp]})
          
        }
        
  }}
      
      >
          {children.map((child) => {
           //s console.log("child",child);
              const values = Object.values(child);
              const category = values[0];
              const depth = values[1];
              const index = values[2];
              const listOrder = values[3];


              return <div className="individual_cat_item" key={`${category}_${listOrder}`} depth={depth} index={index}
                ref={ref2}
                onMouseEnter={
                  (event) => {
                      if (hoverItems.includes(category)){
                        const index = hoverItems.indexOf(category);
                        const temp = hoverItems.slice(0, index);
                        temp.push(category)
                        //temp.delete(category);
                        dispatch({type: 'hover/set', payload: [...temp]})
                      }
                      else{
                        
                        const temp = new Set(hoverItems);
                        temp.delete(todelete);
                        temp.add(category);
                        dispatch({type: 'hover/set', payload: [...temp]})
                      }
                      
                  }
                }

                onMouseLeave={ (event) => {
                      const boundRectOfContainer = ref.current.getBoundingClientRect();
                      const boundRectOfChild = ref2.current.getBoundingClientRect();

                      const x = boundRectOfChild.width + boundRectOfChild.left;
                      const y = boundRectOfChild.height + boundRectOfChild.top;

                      const xc = boundRectOfContainer.width + boundRectOfContainer.left;

                      const yc = boundRectOfContainer.height + boundRectOfContainer.top;
                      
                      console.log("xc yc",xc, yc, "screenx screeny", event.screenX, event.screenY)
                      if (event.screenY >= y && event.screenY > 0 && event.screenX <= x ){
                        console.log("category",category)

                        
                        const index = hoverItems.indexOf(category);
                        todelete = category
                        const temp = hoverItems.slice(0, index);
                        console.log("temp",temp);
                        //temp.push(category)
                        
                        dispatch({type: 'hover/set', payload:[...temp]})
                        
                      }
                      
                }}
              > {category} </div> 
          })}

      </div>
  )

}




function App() {
  const [categories, setCategories] = useState();
  const traversedData = traverseFromHere();
  const groupedData = groupByParent(traversedData).groupedData;
  //console.log(categories)
  const [components, setComponents] = useState(groupedData);
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
      {
        components.map((component, index) => {
          console.log(component);
          return <SideMenu key={index} content={component}/>
        })
      }
      
    </div>
  )
}

export default App;