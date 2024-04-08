import React from "react";
import "./styles/CategoryList.scss";

const CategoryList = (props) =>{
    
    const openCaret = (evt) =>{
        
        let domEle = evt.currentTarget;
        domEle.parentElement.querySelector(".nested").classList.toggle("active");
         domEle.classList.toggle("caret-down");
    }
    const getListView = (it) =>{
      return ( 
      <ul class="nested">
       {
            it?.children && it.children.length > 0 &&
            it.children.map((itr, idx) =>{
                
               return(     
               <> { itr?.children && itr.children.length > 0 ? 
                <li>
                   <span class="caret" onClick={openCaret}><span className="category-block">{itr.name}</span><span>{itr.description}</span></span>
                   {getListView(itr)}
              </li>  : <li><span className="category-block">{itr.name}</span><span>{itr.description}</span></li>}
                
                </>)
               
            })
        }
        </ul>
        )
    }
    return(
        <>
            <ul id="myUL">
                { props?.rowData &&  props.rowData.map((itr,idx) => {
                    
                    return ( itr?.children && itr.children.length > 0 ? 
                        <li>
                            <span class="caret" onClick={openCaret}><span className="category-block">{itr.name}</span><span>{itr.description}</span></span>
                            {getListView(itr)}
                    </li>  : <li><span className="category-block">{itr.name}</span><span>{itr.description}</span></li>
                        )
                    
                    })}
                </ul>
        </>
    )
}

export default CategoryList;