import { useState } from "react";
import "./update.scss";
import { useMutation, useQueryClient } from "react-query";
import { makeRequest } from "../../axios";

const Update = ({ setOpenUpdate, userData }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);

  const [details, setDetails] = useState({
    name: "",
    city: "",
    website: "",
  });

  const handleChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await makeRequest.post("/upload", formData);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Create a client
  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: "users" });
      },
    }
  );

  const handleUpdate = async (e) => {
    e.preventDefault();

    // getting userData from share page with props to update userDetails
    let coverIMG = cover ? await upload(cover) : userData.coverPic;
    let profileIMG = profile ? await upload(profile) : userData.profilePic;

    // refetch
    mutation.mutate({ ...details, coverPic: coverIMG, profilePic: profileIMG });
    setOpenUpdate(false);
  };
  return (
    <div className="update">
      Update
      <form action="" method="post"></form>
      <form onSubmit={handleUpdate}>
        <input type="file" onChange={(e) => setCover(e.target.files[0])} />
        <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
        <input type="text" name="name" onChange={handleChange} />
        <input type="text" name="city" onChange={handleChange} />
        <input type="text" name="website" onChange={handleChange} />
        <button type="submit">Update</button>
      </form>
      <button onClick={() => setOpenUpdate(false)}>X</button>
    </div>
  );
};

export default Update;
