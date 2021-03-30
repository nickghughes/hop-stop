defmodule HopStop.MeetMeHeresTest do
  use HopStop.DataCase

  alias HopStop.MeetMeHeres

  describe "meetmeheres" do
    alias HopStop.MeetMeHeres.MeetMeHere

    @valid_attrs %{brewery_id: 42}
    @update_attrs %{brewery_id: 43}
    @invalid_attrs %{brewery_id: nil}

    def meet_me_here_fixture(attrs \\ %{}) do
      {:ok, meet_me_here} =
        attrs
        |> Enum.into(@valid_attrs)
        |> MeetMeHeres.create_meet_me_here()

      meet_me_here
    end

    test "list_meetmeheres/0 returns all meetmeheres" do
      meet_me_here = meet_me_here_fixture()
      assert MeetMeHeres.list_meetmeheres() == [meet_me_here]
    end

    test "get_meet_me_here!/1 returns the meet_me_here with given id" do
      meet_me_here = meet_me_here_fixture()
      assert MeetMeHeres.get_meet_me_here!(meet_me_here.id) == meet_me_here
    end

    test "create_meet_me_here/1 with valid data creates a meet_me_here" do
      assert {:ok, %MeetMeHere{} = meet_me_here} = MeetMeHeres.create_meet_me_here(@valid_attrs)
      assert meet_me_here.brewery_id == 42
    end

    test "create_meet_me_here/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = MeetMeHeres.create_meet_me_here(@invalid_attrs)
    end

    test "update_meet_me_here/2 with valid data updates the meet_me_here" do
      meet_me_here = meet_me_here_fixture()
      assert {:ok, %MeetMeHere{} = meet_me_here} = MeetMeHeres.update_meet_me_here(meet_me_here, @update_attrs)
      assert meet_me_here.brewery_id == 43
    end

    test "update_meet_me_here/2 with invalid data returns error changeset" do
      meet_me_here = meet_me_here_fixture()
      assert {:error, %Ecto.Changeset{}} = MeetMeHeres.update_meet_me_here(meet_me_here, @invalid_attrs)
      assert meet_me_here == MeetMeHeres.get_meet_me_here!(meet_me_here.id)
    end

    test "delete_meet_me_here/1 deletes the meet_me_here" do
      meet_me_here = meet_me_here_fixture()
      assert {:ok, %MeetMeHere{}} = MeetMeHeres.delete_meet_me_here(meet_me_here)
      assert_raise Ecto.NoResultsError, fn -> MeetMeHeres.get_meet_me_here!(meet_me_here.id) end
    end

    test "change_meet_me_here/1 returns a meet_me_here changeset" do
      meet_me_here = meet_me_here_fixture()
      assert %Ecto.Changeset{} = MeetMeHeres.change_meet_me_here(meet_me_here)
    end
  end
end
