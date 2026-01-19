"use client";

import React, { useState, useEffect } from "react";

export default function AlgorithmWindow() {
  const [array, setArray] = useState<number[]>([]);
  const [isSorting, setIsSorting] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string>("");
  const [speed, setSpeed] = useState(100);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);

  const algorithms = [
    { name: "Bubble Sort", value: "bubble" },
    { name: "Selection Sort", value: "selection" },
    { name: "Insertion Sort", value: "insertion" },
    { name: "Quick Sort", value: "quick" },
    { name: "Merge Sort", value: "merge" }
  ];

  // Generate random array
  const generateArray = () => {
    const newArray = Array.from({ length: 50 }, () => Math.floor(Math.random() * 140) + 10);
    setArray(newArray);
  };

  // Initialize array on component mount
  useEffect(() => {
    generateArray();
  }, []);

  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSorting && startTime > 0) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isSorting, startTime]);

  // Bubble Sort
  const bubbleSort = async (arr: number[]) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise(resolve => setTimeout(resolve, speed / 2));
        }
      }
    }
  };

  // Selection Sort
  const selectionSort = async (arr: number[]) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }
    }
  };

  // Insertion Sort
  const insertionSort = async (arr: number[]) => {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j = j - 1;
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }
      arr[j + 1] = key;
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, speed / 2));
    }
  };

  // Quick Sort
  const quickSort = async (arr: number[], low: number = 0, high: number = arr.length - 1) => {
    if (low < high) {
      const pivotIndex = await partition(arr, low, high);
      await quickSort(arr, low, pivotIndex - 1);
      await quickSort(arr, pivotIndex + 1, high);
    }
  };

  const partition = async (arr: number[], low: number, high: number) => {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await new Promise(resolve => setTimeout(resolve, speed / 2));
    return i + 1;
  };

  // Merge Sort
  const mergeSort = async (arr: number[], left: number = 0, right: number = arr.length - 1) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await mergeSort(arr, left, mid);
      await mergeSort(arr, mid + 1, right);
      await merge(arr, left, mid, right);
    }
  };

  const merge = async (arr: number[], left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, speed / 2));
    }
    
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++;
      k++;
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, speed / 2));
    }
    
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++;
      k++;
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, speed / 2));
    }
  };

  const startSorting = async (algorithm: string) => {
    if (isSorting) return;
    
    setIsSorting(true);
    setCurrentAlgorithm(algorithm);
    setElapsedTime(0);
    setStartTime(Date.now());
    
    const arr = [...array];
    
    switch (algorithm) {
      case "bubble":
        await bubbleSort(arr);
        break;
      case "selection":
        await selectionSort(arr);
        break;
      case "insertion":
        await insertionSort(arr);
        break;
      case "quick":
        await quickSort(arr);
        break;
      case "merge":
        await mergeSort(arr);
        break;
    }
    
    setIsSorting(false);
    setCurrentAlgorithm("");
  };

  return (
    <div className="h-full flex flex-col bg-black/20 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-theme bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-theme">Algorithm Visualizer</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-theme-2 text-sm">Speed:</label>
            <input
              type="range"
              min="50"
              max="200"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              disabled={isSorting}
            />
            <span className="text-theme-2 text-xs min-w-[3rem]">{speed}ms</span>
          </div>
          <button
            onClick={generateArray}
            disabled={isSorting}
            className="px-4 py-2 bg-red-800 hover:bg-red-700 text-red-100 text-sm rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-105 active:scale-95"
          >
            New Array
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4">
        {/* Algorithm Selection - Compact */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {algorithms.map((algo) => (
            <button
              key={algo.value}
              onClick={() => startSorting(algo.value)}
              disabled={isSorting}
              className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 ${
                currentAlgorithm === algo.value
                  ? "bg-red-600 text-white"
                  : isSorting
                  ? "bg-black/40 text-white cursor-not-allowed"
                  : "bg-black/30 text-theme-2 hover:bg-black/40 hover:text-red-300"
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>

        {/* Visualization - Main Focus */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex items-end justify-center gap-1 h-48 bg-black/20 backdrop-blur-sm rounded-xl p-3 w-full max-w-3xl">
            {array.map((value, index) => (
              <div
                key={index}
                className="transition-all duration-100 ease-out rounded-sm"
                style={{
                  height: `${(value / 150) * 180}px`,
                  width: `${Math.max(3, 100 / array.length)}%`,
                  minWidth: '3px',
                  backgroundColor: '#991b1b',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-6 text-sm text-theme-2 font-mono">
            <span>{array.length} elements | Max: {Math.max(...array)}</span>
            {isSorting && (
              <span className="text-red-400">
                Time: {(elapsedTime / 1000).toFixed(2)}s
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
