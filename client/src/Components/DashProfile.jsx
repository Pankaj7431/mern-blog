import { Alert, Button, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase.js";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
} from "../Redux/User/userSlice.js";

export default function DashProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imgFileURL, setImgFileURL] = useState(null);
  const [imgFileProgress, setImgFileProgress] = useState(null);
  const [imgFileError, setImgFileError] = useState(null);
  const [imgUpload, setImgUpload] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImgFileURL(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgFileProgress(progress.toFixed(0));
        setImgUpload(true);
      },
      (error) => {
        setImgFileError("Could not upload Image(File must be less than 2MB)");
        setImgUpload(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgFileURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImgUpload(false);
        });
      }
    );
  };
  const handleUserDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No Changes Made");
      return;
    }
    if (imgUpload) {
      setUpdateUserError("Wait while image is uploading!");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setImgFileProgress(false);
        setUpdateUserSuccess("User Updated SuccessFully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = (await res).json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
      navigate("/");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full min-h-screen">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImgChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-xl
        overflow-hidden rounded-full relative"
          onClick={() => {
            filePickerRef.current.click();
          }}
        >
          {imgFileProgress && (
            <CircularProgressbar
              value={imgFileProgress || 0}
              text={`${imgFileProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${imgFileProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imgFileURL || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full border-8 
            border-[lightgray] object-cover ${
              imgFileProgress && imgFileProgress < 100 && "opacity-60"
            }`}
          />
        </div>
        {imgFileError && <Alert color="failure">{imgFileError}</Alert>}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleUserDataChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleUserDataChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleUserDataChange}
        />

        <Button type="submit" gradientDuoTone="purpleToBlue" outline disabled={loading || imgUpload}>
          Update
        </Button>
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              outline
              className="w-full"
            >
              Create Post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete this account?
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          </div>
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300 truncate">
            Are you sure you want to delete this account?
          </h3>
          <div className="flex justify-between">
            <Button color="failure" onClick={handleDeleteUser}>
              Yes I'm sure
            </Button>
            <Button
              color="dark"
              onClick={() => {
                showModal(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
