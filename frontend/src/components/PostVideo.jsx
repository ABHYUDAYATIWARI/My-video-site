import React, { forwardRef, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import ButtonType2 from "./ButtonType2";
import videoRel from "../backendRelated/videoRel";

const PostVideo=forwardRef((props,ref)=> {

  const { register, handleSubmit,formState:{errors} } = useForm();
  useRef
  const [files, setFiles] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = [...e.dataTransfer.files];
    setFiles(droppedFiles);
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = [...e.target.files];
    setFiles(selectedFiles);
  };

  const onSubmit=(data)=>{
    console.log(data);
    videoRel.publishVideo(data,"data in form of video")   
    ref.current.classList.toggle("hidden")    
}

  return (
    
    <div className=" sm:w-full  bg-[#121212] p-3 z-20 w-s">
      {errors.videoFile && (
      <p className="text-red-500 mt-2 z-40">
        *{errors.videoFile.message}
      </p>
    )}
      {errors.title && (
      <p className="text-red-500 mt-2 z-40">
        *{errors.title.message}
      </p>
    )}
      {errors.thumbnail && (
      <p className="text-red-500 mt-2 z-40">
        *{errors.thumbnail.message}
      </p>
    )}
      {errors.description && (
      <p className="text-red-500 mt-2 z-40">
        *{errors.description.message}
      </p>
    )}
      <div className="w-full border border-white bg-[#121212]">
        <form onSubmit={handleSubmit}>
          <div className="mx-20  flex justify-center h-80 border border-dashed mt-2 items-center ">
            <div
              className="drop-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <FontAwesomeIcon
                icon={faUpload}
                className="text-7xl text-orange-400 bg-orange-200 p-5 rounded-full"
              />{" "}
              <br />
              <div className="sm:-translate-x-10">
                <label htmlFor="fileInput">
                  Drag & Drop files to upload <br />
                </label>
              </div>
              <div className="">
                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileInputChange}
                  placeholder="select file"
                  className="file:bg-orange-500 file:border-black text-white file:font-bold  file:shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] "
                  {...register("videoFile",{required:"Video file is required"})}
                />
              </div>
            </div>
          </div>
          <div className="mx-20 mt-4">
            <h3>Thumbnail *</h3>
            <div className="w-full border border-white p-3 rounded-md">
              <input type="file" className="file:bg-orange-500" {...register("thumbnail",{required:"thumbnail is required"})}/>
            </div>
            <h3 className="mt-4">Title*</h3>
            <input
              type="text"
              className="w-full bg-transparent border border-white rounded-md px-3 py-1"
              {...register("title",{required:"title is required"})}
            />
            <h3 className="mt-4">Description*</h3>
            <input
              type="text"
              className="w-full bg-transparent border min-h-52   border-white rounded-md px-3 py-1"
              {...register("description",{required:"description is required"})}
            />
            <div className="w-full flex justify-around my-4 text-xl">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="option"
                  value={true}
                  {...register("isPublished")}
                />
                <span className="ml-2">Public</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="option"
                  value={false}
                  {...register("isPublished")}
                />
                <span className="ml-2">Private</span>
              </label>
            </div>
            <div className="flex justify-center my-2 w-full">
          <ButtonType2 props={handleSubmit(onSubmit)}>save</ButtonType2>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
})

export default PostVideo;
// file-input text-center bg-orange-500 font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]
