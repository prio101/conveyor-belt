import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types";


// component
const ConveyorBelt = (props) => {

  const [currentPage, setCurrentPage] = useState(props.defaultBased);
  const [breaks, setBreaks] = useState(props.defaultBreaks);
  const [items, setItems] = useState(props.items);
  const [totalPages, setTotalPages] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [currentStart, setCurrentStart] = useState(1);
  const [currentEnd, setCurrentEnd] = useState(1);


  const defineTotalPagesFunc = () => {
    try {
      let totalPageNumber = Math.ceil(props.items.length / breaks);
      console.log("length of the items", props.items.length);
      setTotalPages(totalPageNumber);
    } catch (error) {
      console.error("Error Messages:", error);
    }
  }

  useEffect(() => {
    if(!isEmpty(props.items.length)) {
      setItems(props.items);

      defineTotalPagesFunc();

      if(currentPage === 1){
        // returnCurrentItems();
      }
    }
  }, [currentStart, currentEnd])

  const isEmpty = (items) => {
    return items.length == 0 ;
  }

  const returnCurrentItems = async () => {
    if(currentStart === 1) {
      console.log("this is one:", currentStart);
      setCurrentEnd(breaks);
    } else {

      console.log(currentStart);
      setCurrentStart(currentStart + breaks);
      setCurrentEnd(currentEnd + breaks);
      console.log(currentStart);
      console.log(currentEnd);
    }
    
    if(!isEmpty(props.items)) {
      let currentItemsCollection = [];
      currentItemsCollection = await props.items.slice(Number(currentStart), Number(currentEnd));
      
      // sendback the current-collection
      props.sendCurrentItemCollection(currentItemsCollection);
    }
  }

  const handleClick = (e, page) => {
    e.preventDefault();
    setCurrentPage(page);
    returnCurrentItems();
  }

  const handlePrev = (e) => {
    e.preventDefault();
    let prevPage = Number(currentPage) - 1;
    prevPage >= 0 ? setCurrentPage(prevPage) : null ;
    returnCurrentItems();
  }

  const handleNext = (e) => {
    e.preventDefault();
    let nextPage = Number(currentPage) + 1 ;
    nextPage <= totalPages ? setCurrentPage(nextPage) : null ;
    returnCurrentItems();
  }

  const range = (end)=> {
    let arr = [];
    for(let index = 0; index < end; index ++ ) {
      arr.push(index); 
    }
    return arr;
  }

  // check if we should set button to disabled
  const disableButton = (button) => {

    switch (button) {
      case 'PREV':
        return currentPage != 1 ? '' : 'cursor-not-allowed opacity-40';
      case 'NEXT':
        return Number(currentPage) == Number(totalPages) ? 'cursor-not-allowed opacity-40' : '';
      case 'CURRENT':
        return currentPage != currentPage ? '' : 'cursor-not-allowed opacity-40'; 
      default:
        break;
    } 
  }

  // check if we should set bg color to active 
  const isCurrentTab = (page) =>
  {
    return currentPage == page ? "bg-brown-800 text-white" : "bg-white text-brown-800" ;
  }


  return(
    <>
    
      { totalPages == 0 ? <>Total page is 0</> : 
        <>
          <div className="m-20 flex flex-1 items-center justify-center">
            
            <div
              className={"cursor-pointer p-6 flex shadow-lg items-center text-base font-semibold hover:text-white hover:bg-brown-800 " + disableButton('PREV') }
              onClick={e => handlePrev(e)}
            >
              <svg
                width="20"
                height="16"
                viewBox="0 0 24 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 9C23.5523 9 24 8.55228 24 8C24 7.44772 23.5523 7 23 7V9ZM0.292892 7.29289C-0.0976315 7.68342 -0.0976315 8.31658 0.292892 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292892 7.29289ZM23 7L1 7V9L23 9V7Z"
                  fill="black"
                />
              </svg>
            </div>
            
            {range(Number(totalPages)).map(page => {
              let currentIndex = Number(page+1) ;
              return(
                <div
                  key={page}
                  className={"cursor-pointer py-5 px-7 flex shadow-lg items-center text-base font-semibold hover:text-white hover:bg-brown-800 " + isCurrentTab(currentIndex) }
                  onClick={ e => handleClick(e, currentIndex) }
                  
                  >
                  { Number(currentIndex) }
                </div>
              )
            })}

            <div
              className={"cursor-pointer p-6 flex shadow-lg items-center text-base font-semibold hover:text-white hover:bg-brown-800 " + disableButton('NEXT')}
              onClick={ e => handleNext(e) }
            >
              <svg
                width="20"
                height="16"
                viewBox="0 0 24 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 9C0.447715 9 0 8.55228 0 8C0 7.44772 0.447715 7 1 7L1 9ZM23.7071 7.29289C24.0976 7.68342 24.0976 8.31658 23.7071 8.70711L17.3431 15.0711C16.9526 15.4616 16.3195 15.4616 15.9289 15.0711C15.5384 14.6805 15.5384 14.0474 15.9289 13.6569L21.5858 8L15.9289 2.34315C15.5384 1.95262 15.5384 1.31946 15.9289 0.928932C16.3195 0.538408 16.9526 0.538408 17.3431 0.928932L23.7071 7.29289ZM1 7L23 7V9L1 9L1 7Z"
                  fill="black"
                />
              </svg>
            </div>
        </div>  
        
      </> }
      
    </>
  )
}

// type checking for the props
ConveyorBelt.propTypes = {
  items: PropTypes.array,
  defaultBased: PropTypes.number,
  defaultBreaks: PropTypes.number,
  sendCurrentItemCollection: PropTypes.func,
}

export default ConveyorBelt;
