import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ReactSession from "react-client-session";
import Homepage from "./HomePage";

export default function Login() {
  /*!
   * Particle Canvas
   * Copyright 2017-2018 Software Laboratory Center, BINUS University
   */
  "use strict";
  const [username, setUsername] = useState();

  const usernameRef = useRef();
  const passwordRef = useRef();

  function Vector(x, y) {
    (this.x = x), (this.y = y);
  }

  function Particle(position, mousePosition, ub, particleMap, chunkSize) {
    (this.position = position),
      (this.mousePosition = mousePosition),
      (this.ub = ub),
      (this.particleMap = particleMap),
      (this.chunkSize = chunkSize),
      (this.radius = 1),
      (this.radiusLb = this.radius + 1),
      (this.radiusUb = 2 * (this.radius + 1)),
      (this.maxSpeed = 0.25 * Math.random()),
      (this.maxForce = 0.01),
      (this.velocity = new Vector(
        20 * Math.random() - 10,
        20 * Math.random() - 10
      )),
      (this.acceleration = new Vector(0, 0)),
      (this.deleteLineDataQueue = []),
      (this.drawedLines = {});
  }

  function ParticleCanvas(canvas, mousePosition) {
    (this.mousePosition = mousePosition),
      (this.context = canvas.getContext("2d")),
      (this.canvasSize = new Vector(canvas.width, canvas.height)),
      (this.chunkSize = new Vector(100, 100)),
      (this.particleList = []),
      (this.particleChunkMap = []);
  }

  (Vector.diff = function (v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }),
    (Vector.add = function (v1, v2) {
      return Vector(v1.x + v2.x, v1.y + v2.y);
    }),
    (Vector.prototype = {
      add: function (v) {
        return (this.x += v.x), (this.y += v.y), this;
      },
      mult: function (factor) {
        return (this.x *= factor), (this.y *= factor), this;
      },
      setValue: function (x, y) {
        (this.x = x), (this.y = y);
      },
      magnitude: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      },
      normalize: function () {
        var magnitudeVal = this.magnitude();
        return (
          (this.x /= Math.abs(magnitudeVal)),
          (this.y /= Math.abs(magnitudeVal)),
          this
        );
      },
      truncate: function (maxValue) {
        return (
          this.magnitude() > maxValue &&
            (this.normalize(), this.mult(maxValue)),
          this
        );
      },
      get key() {
        return Math.floor(this.x) + "|" + Math.floor(this.y);
      },
    }),
    (Particle.prototype = {
      update: function () {
        return (
          this.velocity.add(this.acceleration),
          this.velocity.truncate(this.maxSpeed),
          this.position.add(this.velocity),
          this.acceleration.mult(0),
          this.position.x > this.ub.x
            ? (this.position.x = 0)
            : this.position.x < 0 && (this.position.x = this.ub.x),
          this.position.y > this.ub.y
            ? (this.position.y = 0)
            : this.position.y < 0 && (this.position.y = this.ub.y),
          this
        );
      },
      clear: function (ctx) {
        ctx.clearRect(
          this.position.x - this.radiusLb,
          this.position.y - this.radiusLb,
          this.radiusUb,
          this.radiusUb
        ),
          this.deleteLineDataQueue
            .splice(0, this.deleteLineDataQueue.length)
            .forEach(function (data) {
              if (
                (ctx.save(),
                ctx.translate(data.x, data.y),
                ctx.rotate(data.degInRad),
                ctx.clearRect(0, -2, data.mag, 4),
                ctx.restore(),
                data.end)
              )
                for (var key in data.end.drawedLines[data.positionKey])
                  delete data.end.drawedLines[data.positionKey][key];
            });
      },
      draw: function (ctx) {
        let mag = Vector.diff(this.mousePosition, this.position).magnitude();
        mag < 150
          ? ((ctx.strokeStyle =
              "rgba(255, 255, 255, " + (150 - mag) / 300 + ")"),
            this.drawLine(ctx, this.position, this.mousePosition),
            (ctx.fillStyle =
              "rgba(255, 255, 255, " + (0.5 + (150 - mag) / 300) + ")"))
          : (ctx.fillStyle = "rgba(250, 250, 250, 0.5)");
        for (
          var row = Math.floor(this.position.y / this.chunkSize.y),
            col = Math.floor(this.position.x / this.chunkSize.x),
            i = Math.max(row - 1, 0);
          i <= row + 1;
          i++
        )
          if (this.particleMap[i])
            for (var j = Math.max(col - 1, 0); j <= col + 1; j++)
              this.particleMap[i][j] &&
                0 != this.particleMap[i][j].length &&
                this.particleMap[i][j].forEach((particle) => {
                  if (
                    particle.position != this.position &&
                    1 != this.drawedLines[particle.position.key]
                  ) {
                    let mag = Vector.diff(
                      particle.position,
                      this.position
                    ).magnitude();
                    mag < this.chunkSize.x &&
                      ((ctx.strokeStyle =
                        "rgba(255, 255, 255, " +
                        (this.chunkSize.x - mag) / this.chunkSize.x +
                        ")"),
                      (particle.drawedLines[this.position.key] = !0),
                      this.drawLine(ctx, this.position, particle.position),
                      (this.deleteLineDataQueue[
                        this.deleteLineDataQueue.length - 1
                      ].end = particle),
                      (this.deleteLineDataQueue[
                        this.deleteLineDataQueue.length - 1
                      ].positionKey = this.position.key));
                  }
                });
        ctx.beginPath(),
          ctx.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            2 * Math.PI
          ),
          ctx.fill();
      },
      drawLine: function (ctx, start, end) {
        var degInRad = this._getDegInRad(start, end),
          mag = Vector.diff(end, start).magnitude();
        ctx.beginPath(),
          ctx.moveTo(start.x, start.y),
          ctx.lineTo(end.x, end.y),
          ctx.stroke(),
          this.deleteLineDataQueue.push({
            degInRad: degInRad,
            x: start.x,
            y: start.y,
            mag: mag,
          });
      },
      _getDegInRad: function (v1, v2) {
        var deg = Math.atan((v2.y - v1.y) / (v2.x - v1.x));
        return v2.x < v1.x && (deg += Math.PI), deg;
      },
      moveTo: function (targetPosition) {
        var desired = Vector.diff(targetPosition, this.position);
        desired.normalize().mult(this.maxSpeed);
        var steer = Vector.diff(desired, this.velocity);
        steer.truncate(this.maxForce), this.acceleration.add(steer);
      },
    });
  var lastTime = performance.now(),
    fps = 0;
  ParticleCanvas.prototype = {
    get totalParticle() {
      return 50;
    },
    getRandomPosition: function () {
      return new Vector(
        Math.random() * this.canvasSize.x,
        Math.random() * this.canvasSize.y
      );
    },
    init: function () {
      for (var i = 0; i < this.totalParticle; i++)
        this.particleList.push(
          new Particle(
            this.getRandomPosition(),
            this.mousePosition,
            this.canvasSize,
            this.particleChunkMap,
            this.chunkSize
          )
        );
      for (
        var totalRow = this.canvasSize.y / this.chunkSize.y,
          totalCol = this.canvasSize.x / this.chunkSize.x,
          row = 0;
        row < totalRow;
        row++
      ) {
        this.particleChunkMap[row] = [];
        for (var col = 0; col < totalCol; col++)
          this.particleChunkMap[row][col] = [];
      }
    },
    clearChunkMap: function () {
      this.particleChunkMap.forEach(function (row) {
        row.forEach(function (chunk) {
          chunk.splice(0, chunk.length);
        });
      });
    },
    setParticleInChunk: function () {
      var particleChunkMap = this.particleChunkMap,
        chunkSize = this.chunkSize;
      this.particleList.forEach(function (particle) {
        var row = Math.floor(particle.position.y / chunkSize.y),
          col = Math.floor(particle.position.x / chunkSize.x);
        particleChunkMap[row][col].push(particle);
      });
    },
    draw: function () {
      var ctx = this.context;
      this.clearChunkMap(),
        this.setParticleInChunk(),
        this.particleList.forEach(function (particle) {
          particle.clear(ctx);
        }),
        this.particleList.forEach(function (particle) {
          particle.update(ctx);
        }),
        this.particleList.forEach(function (particle) {
          particle.draw(ctx);
        }),
        requestAnimationFrame(this.draw.bind(this));
    },
  };

  function handleLogin(e) {
    e.preventDefault();

    const data = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    axios
      .post("http://localhost:9000/login/student", data)
      .then((response) => {
        if (response.data.User == undefined) {
          // usernya ga ketemu
          console.log("user not found");
        } else {
          // user ketemu
          console.log(response.data.User);
          ReactSession.setStoreType("localStorage");
          let obj = response.data.User;
          let email = obj.Emails[0];
          let name = obj.Name;
          let role = obj.Role;
          let nim = obj.UserName;
          let userId = obj.UserId;
          ReactSession.set("email", email);
          ReactSession.set("name", name);
          ReactSession.set("role", role);
          ReactSession.set("nim", nim);
          ReactSession.set("userId", userId);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    let canvas = document.getElementById("particle-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mousePosition = new Vector(0, 0);
    window.addEventListener("mousemove", function (e) {
      mousePosition.setValue(e.clientX, e.clientY);
    });

    let particleCanvas = new ParticleCanvas(canvas, mousePosition);
    particleCanvas.init();
    particleCanvas.draw();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center bg-blue-900 py-12 sm:px-6 lg:px-8">
      <canvas
        className="fixed z-0 w-max"
        id="particle-canvas"
        height={"726"}
      ></canvas>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white pb-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md flex mb-4">
            <img
              className="h-24 mr-2"
              src="https://bluejack.binus.ac.id/prk/assets/ribbon.png"
            ></img>
            <img
              className="h-20 pt-2 mt-2"
              src="https://bluejack.binus.ac.id/prk/assets/binus.png"
            ></img>
          </div>

          <form className="space-y-6 relative" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                NIM
              </label>
              <div className="mt-1">
                <input
                  id="text"
                  name="text"
                  type="text"
                  ref={usernameRef}
                  autoComplete="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  ref={passwordRef}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
