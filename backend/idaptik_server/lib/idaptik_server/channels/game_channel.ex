defmodule IdaptikServerWeb.GameChannel do
  use Phoenix.Channel

  # This function handles a client's request to join a topic.
  # For example, joining "game:lobby" or "game:<game_id>".
  def join("game:" <> _game_id = topic, _params, socket) do
    # You might add authentication or game-specific authorization here.
    {:ok, socket}
  end

  # Handle incoming "player_move" messages from a connected client.
  # We broadcast this to all subscribers of the topic.
  def handle_in("player_move", %{"player_id" => player_id, "x" => x, "y" => y} = payload, socket) do
    broadcast!(socket, "player_move", payload)
    {:noreply, socket}
  end

  # An additional example: handle a chat message.
  def handle_in("chat_message", %{"player_id" => player_id, "message" => message} = payload, socket) do
    broadcast!(socket, "chat_message", payload)
    {:noreply, socket}
  end

  # Optionally, you can define callbacks for when a client leaves the channel,
  # handles errors, or any custom events you need.
  def terminate(_reason, _socket) do
    :ok
  end
end
