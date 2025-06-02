# IDApTIK Phoenix Server

## Overview

IDApTIK Phoenix Server is the backend for the IDApTIK multiplayer game. Built with Phoenix, Ecto, and Cowboy, this server provides real-time communication via Phoenix Channels and manages persistent game state with Ecto. It integrates seamlessly with a vanilla TypeScript frontend powered by Excalibur/Phaser, ensuring a smooth multiplayer gaming experience.

## Features

- **Real-Time Multiplayer:**  
  Leverages Phoenix Channels to broadcast live game updates between players.
  
- **Persistent State Management:**  
  Uses Ecto to manage game and player state with database-backed storage for reliability.
  
- **RESTful API Endpoints:**  
  Provides controllers for game and player interactions, enabling external integrations.
  
- **Scalable Architecture:**  
  Built on the BEAM VM ensuring fault tolerance and concurrency for a high-performance multiplayer environment.

## Prerequisites

- **Elixir & Erlang/OTP:**  
  Install via [Elixir’s official guide](https://elixir-lang.org/install.html).

- **Phoenix:**  
  Follow the [Phoenix installation guide](https://hexdocs.pm/phoenix/installation.html).

- **Database:**  
  A compatible database is required (PostgreSQL is recommended).

## Installation

1. **Clone the Repository**

   ```sh
   git clone https://github.com/yourusername/idaptik_server.git
   cd idaptik_server
