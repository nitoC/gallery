import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { useAuth0 } from "@auth0/auth0-react";
import { storage } from "./firbase/firebase";
import React, { useRef, useState } from "react";
import { Header } from "./components/Header";
import { useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Home = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

 
  const [images, setimages] = useState([]);
  const [imageOrder, setImageOrder] = useState([]);
  const [isUpload, setisUpload] = useState(false);
  const listRef = ref(storage, "images/");

  const input = useRef();

  const handleImage = (data)=>{
    if(data === ''){
        getImages();
        return;
    }
    const time = setTimeout(() => {
        clearTimeout(time)
        
        setimages(data)
        setImageOrder([...Array(data.length).keys()]);
    }, 1000);
  }
  const handleDrop = (e) => {
    e.preventDefault();
    e.target.classList.add("highlight");
  };
  const handleUpload = useCallback((e) => {
    e.preventDefault();
   
    e.target.classList.remove("highlight");
    input.current.files = e.dataTransfer.files;
    const storageRef = ref(storage, `images/${e.dataTransfer.files[0].name}`);

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, e.dataTransfer.files[0]).then((snapshot) => {
      setimages((prev) => [...prev, ""]);
      setisUpload(true);
      console.log(input.current.files);
    });
    setTimeout(() => {
      setisUpload(false);
    }, 1000);
  });

  const handleLeave = (e) => {
    e.target.classList.remove("highlight");
  };
  const fileUpload = (e) => {
    console.log(e.target.files[0].name);
    if (!e.target.files) {
      return;
    }
    const storageRef = ref(
      storage,
      e.target.files[0].name ? `images/${e.target.files[0].name}` : ""
    );
    console.log(e.target.name);
    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, e.target.files).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  };
 
  const getImages = async () => {
    let imgArr = [];
    let imgFiles = await listAll(listRef);
    let img = imgFiles.items;

    imgArr = await Promise.all(
      img.map(async (element) => {
        return await getDownloadURL(element);
      })
    );
    console.log(imgArr);
    setimages(imgArr);
    setImageOrder([...Array(imgArr.length).keys()]);
    console.log(images);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside the list
    const reorderedImages = [...imageOrder];
    const [reorderedItem] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, reorderedItem);
    setImageOrder(reorderedImages);
  };

  useEffect(() => {
    getImages();
  }, [isUpload]);
  if (isAuthenticated) {
    return (
      <div className="home">
        <Header images={images} handleImage={handleImage}/>
        <div
          onDragOver={handleDrop}
          onDragLeave={handleLeave}
          onDrop={handleUpload}
          htmlFor="image"
        >
          <input
            onChange={fileUpload}
            ref={input}
            type="file"
            accept="images/*"
            id="image"
            className="image"
            hidden
          />
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="image-list" direction="horizontal">
            {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="images"
                            >
                                {imageOrder.map((index) => (
                                    <Draggable
                                        key={index}
                                        draggableId={`image-${index}`}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="image-wrapper handle"
                                            >
                                                <img src={images[index]} alt="gallery" />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <h1>Loading and checking credencials...</h1>
        <h2>
          if page persists try signing up if you don't have an account or enter
          login credentials again
        </h2>
        <button onClick={loginWithRedirect}> Login</button>
      </>
    );
  }
};

export default Home;
